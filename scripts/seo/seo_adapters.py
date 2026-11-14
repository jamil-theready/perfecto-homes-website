"""Bounded, policy-enrolled adapters; never edit offers, routing, schema or forms."""
import html
import json
from pathlib import Path
import re
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET


class UnsupportedAdapter(ValueError):
    pass


def safe_source(root, relative):
    path = root / relative
    if Path(relative).is_absolute() or '..' in Path(relative).parts or path.is_symlink() or not path.resolve().is_relative_to(root.resolve()):
        raise ValueError('Adapter source escapes enrolled client repository')
    return path


def metadata_span(source):
    match = re.search(r'export const metadata:\s*Metadata\s*=\s*\{(.*?)\n\};', source, re.S)
    if not match:
        raise UnsupportedAdapter('Only an explicit static Next metadata object is supported')
    return match


def static_metadata(source):
    block = metadata_span(source).group(1)
    fields = {}
    for name in ['title', 'description']:
        match = re.search(r'^\s*' + name + r':\s*("(?:[^"\\]|\\.)*")\s*,', block, re.M)
        if not match:
            raise UnsupportedAdapter('Dynamic or unsupported metadata syntax: ' + name)
        fields[name] = json.loads(match.group(1))
    return fields


def apply_metadata(source, change):
    if set(change) != {'title', 'description'}:
        raise ValueError('Metadata adapter edits exactly title and description')
    static_metadata(source)
    match = metadata_span(source)
    block = match.group(1)
    for name, value in change.items():
        block, count = re.subn(r'(^\s*' + name + r':\s*)("(?:[^"\\]|\\.)*")(\s*,)',
                               lambda m: m.group(1) + json.dumps(value, ensure_ascii=False) + m.group(3), block, count=1, flags=re.M)
        if count != 1:
            raise UnsupportedAdapter('Ambiguous metadata field')
    return source[:match.start(1)] + block + source[match.end(1):]


def aggregate_pages(evidence):
    return {urlparse(row['keys'][0]).path.rstrip('/') or '/': row for row in evidence.get('pages', [])}


def choose_metadata(root, evidence, policy, state, today):
    from datetime import date
    last = state.get('last_release')
    if last and (today-date.fromisoformat(last)).days < policy['release_interval_days']:
        return None
    totals = aggregate_pages(evidence)
    choices = []
    for spec in policy.get('adapters', {}).get('metadata_pages', []):
        if spec.get('adapter') != 'next-static-metadata' or spec.get('enabled') is not True:
            continue
        path = urlparse(spec['url']).path.rstrip('/') or '/'
        if urlparse(spec['url']).hostname != urlparse(policy['site']).hostname:
            raise ValueError('Metadata URL belongs to a different client')
        try:
            source = safe_source(root, spec['path']).read_text()
            static_metadata(source)
        except (ValueError,OSError):
            continue
        row = totals.get(path)
        previous = state.get('pages', {}).get('metadata:'+path, {}).get('released')
        if previous and (today-date.fromisoformat(previous)).days < policy['page_cooldown_days']:
            continue
        queries = [r['keys'][1] for r in evidence.get('rows', []) if urlparse(r['keys'][0]).path.rstrip('/') == path]
        if not row or not any(term.lower() in ' '.join(queries).lower() for term in policy['market_terms']):
            continue
        impressions, clicks = row.get('impressions', 0), row.get('clicks', 0)
        ctr = clicks/max(impressions, 1)
        if impressions >= 25 and ctr < .03 and 3 <= row.get('position', 100) <= 30:
            choices.append({'kind':'service-metadata','slug':'metadata:'+path,'path':spec['path'], 'url':spec['url'],
                            'impressions':impressions,'clicks':clicks,'ctr':ctr,'position':row['position'],'queries':queries})
    return max(choices, key=lambda row: row['impressions']*(.04-row['ctr']), default=None)


def apply_internal_link(source, rules):
    """One existing phrase in a plain paragraph; never touch markup or frontmatter."""
    parts = re.split(r'(^---\s*\n.*?\n---[ \t]*\n)', source, maxsplit=1, flags=re.S)
    if len(parts) != 3:
        raise UnsupportedAdapter('Internal links require Markdown frontmatter')
    body = parts[2]
    for rule in rules:
        target, anchor = rule['target'], rule['anchor']
        if not re.fullmatch(r'/[a-z0-9/-]*', target) or '//' in target or not re.fullmatch(r'[A-Za-zÀ-ÿ ]{4,70}', anchor):
            raise ValueError('Internal link must use a fixed safe path and existing phrase')
        if target in body:
            continue
        # Legacy editorial articles use HTML paragraphs. Only plain text inside a
        # paragraph is eligible; no existing tag, attribute or nested link is edited.
        for paragraph in re.finditer(r'<p(?:\s+[^>]*)?>([^<>]*)</p>', body, re.I):
            match = re.search(r'(?<!\w)' + re.escape(anchor) + r'(?!\w)', paragraph.group(1))
            if match:
                at = paragraph.start(1) + match.start()
                updated = body[:at] + '<a href="'+target+'">'+html.escape(anchor)+'</a>' + body[at+len(anchor):]
                return parts[0]+parts[1]+updated, [{'anchor':anchor,'target':target}]
        offset = 0
        fenced = False
        for line in body.splitlines(keepends=True):
            if line.lstrip().startswith(('```', '~~~')):
                fenced = not fenced
            # Keep HTML, existing links, code, headings, lists and factual data intact.
            if not fenced and not line.lstrip().startswith(('#', '-', '*', '>', '|')) and not re.search(r'[<>\[\]`]', line):
                match = re.search(r'(?<!\w)' + re.escape(anchor) + r'(?!\w)', line)
                if match:
                    at = offset + match.start()
                    updated = body[:at] + '['+anchor+']('+target+')' + body[at+len(anchor):]
                    return parts[0]+parts[1]+updated, [{'anchor':anchor,'target':target}]
            offset += len(line)
    return source, []


def fetch_text(url, opener=urlopen):
    with opener(Request(url, headers={'User-Agent':'TRC-Monthly-SEO-Audit/1.0'}), timeout=30) as response:
        final = response.geturl()
        if urlparse(final).scheme != 'https' or urlparse(final).hostname != urlparse(url).hostname:
            raise ValueError('Audit redirected outside the configured HTTPS site')
        return response.read(2_000_000).decode(errors='replace')


def monthly_audit(root, policy, evidence, fetcher=fetch_text):
    result = {'metadata': [], 'internal_links': [], 'technical': [], 'issues': []}
    adapters = policy.get('adapters', {})
    for spec in adapters.get('metadata_pages', []):
        if spec.get('enabled') is not True:
            continue
        try:
            fields = static_metadata(safe_source(root, spec['path']).read_text())
            row = {'url':spec['url'], 'adapter':spec['adapter'], 'state':'reviewed',
                   'title_length':len(fields['title']), 'description_length':len(fields['description'])}
            if not 15 <= len(fields['title']) <= 90 or not 90 <= len(fields['description']) <= 165:
                result['issues'].append({'kind':'metadata_length','url':spec['url']})
        except (ValueError, OSError):
            row = {'url':spec['url'], 'state':'unsupported'}
            result['issues'].append({'kind':'metadata_adapter_unsupported','url':spec['url']})
        result['metadata'].append(row)
    rules = adapters.get('internal_links', [])
    for path in sorted((root/policy['blog_dir']).glob('*.md')) if rules else []:
        try:
            source = path.read_text()
            _, links = apply_internal_link(source, rules)
            result['internal_links'].append({'path':str(path.relative_to(root)), 'state':'reviewed', 'available_links':len(links)})
        except (ValueError, OSError):
            result['internal_links'].append({'path':str(path.relative_to(root)), 'state':'unsupported'})
    for check in adapters.get('technical_checks', []):
        url = policy['site'].rstrip('/') + check['path']
        row = {'kind':check['kind'], 'url':url, 'state':'reviewed', 'passed':False}
        try:
            text = fetcher(url)
            if check['kind'] == 'robots':
                parser = RobotFileParser(url)
                parser.parse(text.splitlines())
                row['passed'] = parser.can_fetch('Googlebot', policy['site']+'/') and bool(re.search(r'^Sitemap:\s*https://', text, re.I|re.M))
            elif check['kind'] == 'sitemap':
                xml = ET.fromstring(text)
                urls = [item.text or '' for item in xml.iter() if item.tag.rsplit('}',1)[-1]=='loc']
                row['passed'] = bool(urls) and all(urlparse(value).hostname == urlparse(policy['site']).hostname for value in urls)
            elif check['kind'] == 'canonical':
                links = re.findall(r'<link\b[^>]*>', text, re.I)
                desired = policy['site'].rstrip('/') + check['path'].rstrip('/')
                canonicals = [html.unescape(m.group(2)).rstrip('/') for tag in links if re.search(r'rel=[\"\']canonical[\"\']',tag,re.I)
                              for m in [re.search(r'href=([\"\'])(.*?)\1',tag,re.I)] if m]
                robot_tags=[tag for tag in re.findall(r'<meta\b[^>]*>',text,re.I) if re.search(r'name=[\"\'](?:robots|googlebot)[\"\']',tag,re.I)]
                blocked=any(re.search(r'content=[\"\'][^\"\']*\b(?:noindex|none)\b',tag,re.I) for tag in robot_tags)
                row['passed'] = canonicals == [desired] and not blocked
            else:
                row['state'] = 'unsupported'
        except Exception as error:
            # HTTP 404 is observed issue evidence; connectivity failure is unavailable.
            from urllib.error import HTTPError
            row['state'] = 'reviewed' if isinstance(error, HTTPError) else 'unavailable'
            row['reason'] = 'http_' + str(error.code) if isinstance(error, HTTPError) else type(error).__name__
        if not row['passed']:
            result['issues'].append({'kind':check['kind'], 'url':url, 'reason':row.get('reason','check_failed')})
        result['technical'].append(row)
    result['coverage'] = {name: ('reviewed' if values and all(row.get('state')=='reviewed' for row in values) else
                                 'unavailable' if any(row.get('state')=='unavailable' for row in values) else 'unsupported')
                          for name, values in [('service_metadata',result['metadata']),('internal_links',result['internal_links']),('technical_audit',result['technical'])]}
    return result


def choose_internal_link(root, evidence, policy, state, today):
    from datetime import date
    rules=policy.get('adapters',{}).get('internal_links',[])
    if not rules or (state.get('last_release') and (today-date.fromisoformat(state['last_release'])).days<policy['release_interval_days']):
        return None
    choices=[]
    for path in sorted((root/policy['blog_dir']).glob('*.md')):
        previous=state.get('pages',{}).get(path.stem,{}).get('released')
        if previous and (today-date.fromisoformat(previous)).days<policy['page_cooldown_days']:
            continue
        url=policy['site'].rstrip('/')+'/blog/'+path.stem
        row=aggregate_pages(evidence).get('/blog/'+path.stem)
        if not row or row.get('impressions',0)<25:
            continue
        source=path.read_text()
        try:
            _,links=apply_internal_link(source,rules)
        except ValueError:
            continue
        if not links:
            continue
        impressions,clicks=row['impressions'],row.get('clicks',0)
        choices.append({'kind':'internal-links','slug':path.stem,'path':str(path.relative_to(root)),
                        'url':url,'impressions':impressions,'clicks':clicks,'ctr':clicks/impressions,
                        'position':row.get('position',100)})
    return max(choices,key=lambda row:row['impressions'],default=None)
