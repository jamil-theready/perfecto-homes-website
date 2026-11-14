"""Repository-scoped monthly claims and fail-closed publication permission.

No scheduler or second account database: the existing workflow persists the claim in
this private repository before using a model. Pausing never resets that claim.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
from datetime import datetime, timezone
from urllib.request import Request, urlopen


WORKFLOW_NAME='seo-autopilot.yml'
WORKFLOW_PATH='.github/workflows/'+WORKFLOW_NAME
STARTUP_VARIABLE='TRC_SEO_ACTIVE'


class PublicationBlocked(ValueError):
    pass


def digest(value):
    return hashlib.sha256(value).hexdigest()


def policy_digest(policy):
    return digest(json.dumps(policy, sort_keys=True).encode())


def cycle_id(policy, now=None):
    return policy['client'] + ':' + (now or datetime.now(timezone.utc)).strftime('%Y-%m')


def publication_permission(policy, environ=None, opener=urlopen):
    """The live workflow state is the primary publishing control.

    TRC_SEO_ACTIVE is an additional startup brake; a stale true snapshot cannot
    override an operator disabling the workflow while a job is queued/running.
    """
    env = os.environ if environ is None else environ
    if policy.get('enabled') is not True:
        raise PublicationBlocked('Client SEO policy is disabled')
    repository = policy.get('repository', '')
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repository):
        raise PublicationBlocked('Invalid client repository')
    if env.get('GITHUB_REPOSITORY') != repository:
        raise PublicationBlocked('Client repository mismatch')
    configured=policy.get('publication_control',{})
    if (configured.get('primary','github-workflow-state')!='github-workflow-state'
            or configured.get('workflow',WORKFLOW_NAME)!=WORKFLOW_NAME):
        raise PublicationBlocked('Unsupported client publication control')
    initial = env.get(STARTUP_VARIABLE)
    if not isinstance(initial,str) or initial.lower() != 'true':
        raise PublicationBlocked('SEO publishing paused by the startup brake')
    token = env.get('GH_TOKEN') or env.get('GITHUB_TOKEN')
    if not token:
        raise PublicationBlocked('Current publication permission cannot be verified')
    request = Request('https://api.github.com/repos/' + repository + '/actions/workflows/'+WORKFLOW_NAME,
                      headers={'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json',
                               'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'TRC-SEO-Permission/1.0'})
    try:
        with opener(request, timeout=20) as response:
            current = json.load(response)
    except Exception:
        raise PublicationBlocked('Current publication permission unavailable; nothing may publish') from None
    if current.get('path') != WORKFLOW_PATH:
        raise PublicationBlocked('Client publishing workflow identity mismatch')
    if current.get('state') != 'active':
        raise PublicationBlocked('SEO publishing paused by the live workflow control')
    return True


def read_ledger(root):
    path = root / 'seo/runner.json'
    return json.loads(path.read_text()) if path.exists() else {'version': 1, 'cycles': {}}


def save_ledger(root, ledger):
    path = root / 'seo/runner.json'
    path.parent.mkdir(exist_ok=True)
    path.write_text(json.dumps(ledger, indent=2, sort_keys=True) + '\n')


def claim(root, policy, run_id, now=None):
    """A claimed month cannot generate again, including manual reruns and retries."""
    ledger = read_ledger(root)
    key = cycle_id(policy, now)
    previous = ledger['cycles'].get(key)
    if previous:
        mode = 'duplicate' if previous.get('state') == 'complete' else 'resume'
        return {'mode': mode, 'cycle_id': key, 'owner_run_id': previous['run_id']}
    ledger['cycles'][key] = {'run_id': str(run_id), 'state': 'claimed',
                             'policy_sha256': policy_digest(policy),
                             'claimed_at': (now or datetime.now(timezone.utc)).isoformat()}
    # A few retained months are sufficient for deduplication and operational review.
    ledger['cycles'] = dict(sorted(ledger['cycles'].items())[-6:])
    save_ledger(root, ledger)
    return {'mode': 'new', 'cycle_id': key, 'owner_run_id': str(run_id)}


def complete_cycle(root, policy, result):
    ledger = read_ledger(root)
    key = result.get('cycle_id') or cycle_id(policy)
    record = ledger['cycles'].get(key)
    if not record:
        raise ValueError('Monthly claim missing; cannot mark execution complete')
    record.update(state='complete', completed_at=datetime.now(timezone.utc).isoformat(),
                  outcome=result.get('state'), completion_run_id=os.environ.get('GITHUB_RUN_ID', 'local'))
    save_ledger(root, ledger)


def allowed_release_paths(policy, candidate):
    path = candidate.get('path', '')
    if Path(path).is_absolute() or '..' in Path(path).parts:
        raise ValueError('Unsafe release path')
    allowed_pages = {row['path'] for row in policy.get('adapters', {}).get('metadata_pages', [])}
    if not (path in allowed_pages or (path.startswith(policy['blog_dir'].rstrip('/') + '/') and path.endswith('.md'))):
        raise ValueError('Release path outside enrolled adapters')
    paths = [path, 'seo/pending.json']
    if candidate.get('kind') == 'article':
        paths.extend(['ASSETS.md', 'public/' + policy['article_media']['path'].lstrip('/')])
    return paths


def checkpoint(root, policy, result):
    """Keep a checked draft in the private run artifact if Off prevents its push."""
    files = []
    names=allowed_release_paths(policy,result['candidate']) if result.get('candidate') else []
    names += [name for name in ['seo/research.json','seo/authority.json','seo/state.json'] if (root/name).exists()]
    for name in names:
        data = (root / name).read_bytes()
        before = subprocess.run(['git', 'show', 'HEAD:' + name], cwd=root, capture_output=True)
        files.append({'path': name, 'before_sha256': digest(before.stdout) if before.returncode == 0 else None,
                      'sha256': digest(data), 'data': base64.b64encode(data).decode()})
    value = {'version': 1, 'client': policy['client'], 'repository': policy['repository'],
             'policy_sha256': policy_digest(policy), 'cycle_id': result['cycle_id'],
             'candidate': result.get('candidate'), 'result':result, 'files': files}
    path = root / 'seo-evidence/checked-release.json'
    path.parent.mkdir(exist_ok=True)
    path.write_text(json.dumps(value) + '\n')


def restore_checkpoint(root, policy, data, expected_cycle):
    if (data.get('client') != policy['client'] or data.get('repository') != policy['repository']
            or data.get('policy_sha256') != policy_digest(policy) or data.get('cycle_id') != expected_cycle):
        raise ValueError('Checked draft does not match current client, policy and month')
    required = set(allowed_release_paths(policy, data['candidate'])) if data.get('candidate') else set()
    allowed = required | {'seo/research.json','seo/authority.json','seo/state.json'}
    files = data.get('files', [])
    names={row.get('path') for row in files}
    if not required.issubset(names) or not names.issubset(allowed) or len(files) != len(names):
        raise ValueError('Checked draft file manifest mismatch')
    staged = []
    for row in files:
        path = root / row['path']
        if not path.resolve().is_relative_to(root.resolve()) or path.is_symlink():
            raise ValueError('Checked draft escapes client repository')
        decoded = base64.b64decode(row['data'], validate=True)
        if len(decoded) > 12_000_000 or digest(decoded) != row['sha256']:
            raise ValueError('Checked draft content hash mismatch')
        current = digest(path.read_bytes()) if path.exists() else None
        if current not in (row['before_sha256'], row['sha256']):
            raise ValueError('Source changed since checked draft; needs a fresh human review')
        staged.append((path, decoded))
    pending = json.loads(next(value for path, value in staged if path.name == 'pending.json')) if data.get('candidate') else data.get('result',{})
    if pending.get('cycle_id') != expected_cycle or pending.get('candidate') != data['candidate']:
        raise ValueError('Checked draft pending result mismatch')
    # Validate the entire manifest before changing any source file.
    for path, value in staged:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(value)
    return pending


# Static names only. No recursive/glob copy from an artifact into the repository.
RESUME_EVIDENCE_NAMES = (
    'search.json', 'audit.json', 'research.json', 'packet.json', 'review.json',
    'keyword-map.json', 'authority.json', 'reporting.json', 'research-diagnostics.json')
MAX_EVIDENCE_FILE_BYTES = 2_000_000
MAX_EVIDENCE_TOTAL_BYTES = 12_000_000
MAX_CHECKPOINT_BYTES = 32_000_000


def stage_resume_evidence(root, downloaded):
    """Validate all original evidence before any source/evidence file is restored."""
    destination = root / 'seo-evidence'
    if destination.is_symlink() or not destination.resolve().is_relative_to(root.resolve()):
        raise ValueError('Resume evidence destination escapes the client repository')
    staged, total = [], 0
    # Keep the previous attempt's outcome, too. Current result/summary are rebuilt
    # by the resumed run and must not erase the original interrupted outcome.
    names = {name:name for name in RESUME_EVIDENCE_NAMES}
    names.update({'result.json':'previous-attempt-result.json',
                  'summary.md':'previous-attempt-summary.md'})
    for original, name in names.items():
        source = downloaded / original
        if not source.exists() and not source.is_symlink():
            continue
        target = destination / name
        if (source.is_symlink() or not source.is_file()
                or not source.resolve().is_relative_to(downloaded.resolve())
                or target.is_symlink() or (target.exists() and not target.is_file())):
            raise ValueError('Invalid original run evidence file')
        size = source.stat().st_size
        total += size
        if size > MAX_EVIDENCE_FILE_BYTES or total > MAX_EVIDENCE_TOTAL_BYTES:
            raise ValueError('Original run evidence exceeds the bounded resume limit')
        value = source.read_bytes()
        if len(value) != size:
            raise ValueError('Original run evidence changed during bounded read')
        try:
            decoded = value.decode('utf-8')
            if original.endswith('.json') and not isinstance(json.loads(decoded), dict):
                raise ValueError()
        except (UnicodeError, ValueError):
            raise ValueError('Original run evidence has an invalid supported format') from None
        staged.append((target,value))
    return staged


def download_checkpoint(root, policy, owner_run_id, expected_cycle):
    if not re.fullmatch(r'\d+', str(owner_run_id)):
        raise ValueError('Invalid original run identity')
    with tempfile.TemporaryDirectory(prefix='trc-seo-resume-') as target:
        download = subprocess.run(['gh', 'run', 'download', str(owner_run_id), '--repo', policy['repository'],
                                   '--name', 'seo-execution-' + str(owner_run_id), '--dir', target],
                                  capture_output=True)
        if download.returncode:
            raise ValueError('Original checked-draft artifact unavailable; monthly generation remains deduplicated')
        path = Path(target) / 'checked-release.json'
        if not path.exists():
            raise ValueError('Previous monthly run has no checked draft; no repeat generation is permitted')
        if path.is_symlink() or not path.is_file() or path.stat().st_size > MAX_CHECKPOINT_BYTES:
            raise ValueError('Invalid or oversized checked-draft artifact')
        staged_evidence=stage_resume_evidence(root,Path(target))
        pending=restore_checkpoint(root,policy,json.loads(path.read_text()),expected_cycle)
        for destination,value in staged_evidence:
            destination.parent.mkdir(parents=True,exist_ok=True)
            destination.write_bytes(value)
        return pending
