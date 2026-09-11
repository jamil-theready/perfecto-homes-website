#!/usr/bin/env python3
"""Daily blog generator for Perfecto Homes Realty.

Reads .seo/context.json to pick a high-priority keyword, calls Gemini
with the full brand-voice system prompt, validates the output frontmatter,
and writes a new markdown file to content/blog/. GitHub Actions handles
the commit + push.

Ported from Gina template (2026-05-20).
"""

import json
import os
import random
import re
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "content" / "blog"
CONTEXT_PATH = ROOT / ".seo" / "context.json"
LINKS_PATH = ROOT / ".seo" / "internal-links.json"

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

SHEET_ID = "1eBRZSxsqTQ5mx8s5MeR1Nf2sUyKcWMBOBEtGLAFCGug"
SHEET_TAB = "posted_content_log"
SITE_BASE = "https://www.perfectohomesrealestate.com"
GSC_SITE = "sc-domain:perfectohomesrealestate.com"
GSC_WINDOW_DAYS = 28


CLUSTER_KEYWORDS = {
    "peruInvestment": [
        "sacred valley real estate investment",
        "cusco luxury real estate market",
        "cusco historic center property for sale",
        "san blas cusco luxury homes",
        "siete cuartones cusco property",
        "urubamba real estate peru",
        "ollantaytambo property for sale",
        "peru beach property investment",
        "chinchero airport property values impact",
    ],
    "peruBuyerProcess": [
        "how to buy property in peru as foreigner",
        "peru real estate closing process",
        "buying peru property dollars vs soles",
        "peru property title insurance sunarp",
        "notario publico peru real estate",
        "peru foreign buyer tax implications",
        "due diligence peru property purchase",
    ],
    "general": [
        "perfecto homes cusco sacred valley property",
        "buying property in peru as a foreigner",
    ],
}

SEASONAL = {
    1: ["cusco property market outlook 2026", "buying property in peru in january", "sacred valley year ahead forecast"],
    2: ["peru property taxes for foreign owners", "sacred valley land prices february", "carnival season urubamba property"],
    3: ["rainy season property inspection peru", "cusco rental demand shoulder season", "sacred valley land due diligence"],
    4: ["semana santa cusco tourism property", "peak season hospitality revenue cusco", "sacred valley guesthouse demand"],
    5: ["dry season buying window cusco", "sacred valley construction season", "inti raymi tourism property impact"],
    6: ["inti raymi cusco peak tourism", "cusco hotel occupancy june", "sacred valley high season rentals"],
    7: ["peak tourist season cusco property", "machu picchu visitor numbers property", "urubamba restaurant season"],
    8: ["august high season sacred valley", "cusco property viewing season", "chinchero airport construction update"],
    9: ["shoulder season cusco property deals", "sacred valley land september", "peru property registration sunarp"],
    10: ["spring in the andes property", "cusco market october pricing", "sacred valley investment outlook"],
    11: ["low season cusco buying opportunity", "peru property closing process", "sacred valley land november"],
    12: ["year end cusco property review", "peru property outlook next year", "holiday season cusco tourism"],
}


def slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9\s-]", "", s.lower())
    s = re.sub(r"\s+", "-", s).strip("-")
    return "-".join(s.split("-")[:6])


def existing_slugs() -> set[str]:
    return {f.stem for f in BLOG_DIR.glob("*.md")}


def load_context() -> dict:
    if not CONTEXT_PATH.exists():
        return {}
    return json.loads(CONTEXT_PATH.read_text())


def load_internal_links() -> str:
    """Build a markdown bullet list of internal links for the prompt."""
    if not LINKS_PATH.exists():
        return ""
    data = json.loads(LINKS_PATH.read_text())
    lines = []
    by_cluster = data.get("byCluster", {})
    for cluster, entries in sorted(by_cluster.items()):
        for e in entries[:6]:
            title = e.get("title", "")
            url = e.get("url", "")
            if title and url:
                lines.append(f"- [{title}]({url})")
    return "\n".join(lines)


def _recent_cluster_counts(n: int = 7) -> dict:
    """Inspect the last N posts (by mtime) and count which cluster each belongs to.
    Used to downweight clusters that have dominated recent output."""
    counts = {c: 0 for c in CLUSTER_KEYWORDS}
    posts = sorted(BLOG_DIR.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)[:n]
    for p in posts:
        slug = p.stem
        for cluster, kws in CLUSTER_KEYWORDS.items():
            for kw in kws:
                if any(token in slug for token in kw.split()[:3] if len(token) > 3):
                    counts[cluster] += 1
                    break
            else:
                continue
            break
    return counts


CLUSTER_HINTS = {
    "peruBuyerProcess": ["sunarp", "notario", "peru foreigner", "peru title", "peru closing", "peru buyer", "buy property in peru", "buying property in peru", "foreigners buy property", "peru lawyer"],
    "peruInvestment": ["sacred valley", "urubamba", "ollantaytambo", "cusco", "andes", "andean", "siete cuartones", "san blas", "chinchero", "peru property", "peru real estate", "peru investment", "lima peru", "machu picchu", "peru"],
}


def _cluster_of(keyword: str) -> "str | None":
    """Determine which cluster a keyword belongs to. First tries exact match,
    then falls back to substring hints (handles opportunity-query keywords
    that aren't in our hardcoded CLUSTER_KEYWORDS dict)."""
    for cluster, kws in CLUSTER_KEYWORDS.items():
        if keyword in kws:
            return cluster
    kw_lower = keyword.lower()
    for cluster, hints in CLUSTER_HINTS.items():
        if any(h in kw_lower for h in hints):
            return cluster
    return None


def fetch_gsc_queries() -> list[dict]:
    """Fetch last N days of GSC query data via the seo-bot service account.
    Returns list of {query, impressions, clicks, position}. Empty list on any error.

    Silent no-op if GCP_SA_KEY_JSON env var is missing (e.g. local dev without secrets)."""
    sa_json = os.environ.get("GCP_SA_KEY_JSON")
    if not sa_json:
        print("(GSC fetch skipped: GCP_SA_KEY_JSON not set)")
        return []
    try:
        from google.oauth2.service_account import Credentials  # type: ignore
        from googleapiclient.discovery import build  # type: ignore

        creds = Credentials.from_service_account_info(
            json.loads(sa_json),
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
        )
        service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
        from datetime import timedelta
        end = datetime.utcnow().date()
        start = end - timedelta(days=GSC_WINDOW_DAYS)
        resp = service.searchanalytics().query(siteUrl=GSC_SITE, body={
            "startDate": str(start),
            "endDate": str(end),
            "dimensions": ["query"],
            "rowLimit": 100,
        }).execute()
        rows = resp.get("rows", [])
        result = []
        for r in rows:
            result.append({
                "query": r["keys"][0],
                "impressions": r.get("impressions", 0),
                "clicks": r.get("clicks", 0),
                "position": r.get("position", 100.0),
            })
        print(f"GSC: pulled {len(result)} queries from last {GSC_WINDOW_DAYS} days")
        return result
    except Exception as e:
        print(f"WARN: GSC fetch failed ({e}); falling back to context.json", file=sys.stderr)
        return []


def pick_keyword(context: dict, used: set[str]) -> tuple[str, str]:
    """Pick a keyword to target. Combines strategic priorities, opportunity queries,
    and seasonal pool. Applies a cluster-diversity penalty so we don't post the same
    cluster repeatedly (apostille pile-up fix, 2026-05-19)."""
    candidates: list[tuple[str, str, "str | None", float]] = []  # (kw, source, cluster, score)

    for sp in context.get("strategicPriorities", [])[:3]:
        cluster = sp.get("cluster")
        for kw in CLUSTER_KEYWORDS.get(cluster, []):
            candidates.append((kw, f"strategic-{cluster}", cluster, 12.0))

    for q in context.get("opportunityQueries", [])[:10]:
        kw = q.get("query", "")
        if kw:
            score = 8.0 + (2.0 if q.get("nearMiss") else 0.0)
            candidates.append((kw, "opportunity-context", _cluster_of(kw), score))

    # LIVE GSC pool — last 28 days of real search performance
    gsc_rows = fetch_gsc_queries()
    if gsc_rows:
        # Score: position 5-30 is the sweet spot (winnable). Weight by impressions.
        gsc_max_imp = max((r["impressions"] for r in gsc_rows), default=1)
        for r in gsc_rows:
            pos = r["position"]
            imp = r["impressions"]
            if not (5 <= pos <= 50 and imp >= 5):
                continue
            # Score peaks at position 11-20 (just-off-page-1), tapers with distance
            position_score = 1.0 - min(abs(pos - 15) / 25.0, 1.0)
            impression_score = imp / gsc_max_imp
            score = 5.0 + 5.0 * position_score + 3.0 * impression_score
            # Bonus for queries with clicks already (validated intent)
            if r["clicks"] > 0:
                score += 2.0
            candidates.append((r["query"], f"gsc-live-pos{pos:.0f}", _cluster_of(r["query"]), score))

    month = datetime.now().month
    for kw in SEASONAL.get(month, []):
        candidates.append((kw, "seasonal", _cluster_of(kw), 4.0))

    # Filter out anything we've already posted
    fresh = [c for c in candidates if slugify(c[0]) not in used]
    if not fresh:
        fresh = [("cusco sacred valley property guide", "fallback", None, 0.0)]

    # Apply cluster-diversity penalty based on recent posts, plus the
    # business-priority bias from context.json (clusterBias). The bias keeps
    # site is Peru-only as of 2026-09-11.
    recent = _recent_cluster_counts(n=7)
    bias = context.get("clusterBias", {})
    print(f"Recent cluster counts (last 7 posts): {recent}")
    penalized = []
    for kw, src, cluster, score in fresh:
        penalty = recent.get(cluster, 0) * 3.0 if cluster else 0.0
        boost = bias.get(cluster, 0.0) if cluster else 0.0
        penalized.append((kw, src, cluster, score - penalty + boost))

    penalized.sort(key=lambda c: c[3], reverse=True)
    # Prefer positive-score candidates; fall back to the negative pool only if nothing else is left
    positive = [c for c in penalized if c[3] > 0]
    pool = positive if positive else penalized
    top = pool[:5]
    print(f"Top {len(top)} candidates:")
    for kw, src, cluster, score in top:
        print(f"  {score:5.1f}  [{cluster or '?':>15}]  {kw}  ({src})")
    chosen = random.choice(top)
    return chosen[0], chosen[1]


def pick_category() -> str:
    weights = {
        "educational": 55,
        "service": 15,
        "personal": 10,
        "cultural": 10,
        "promo": 10,
    }
    pool = [cat for cat, w in weights.items() for _ in range(w)]
    return random.choice(pool)


def build_system_prompt(internal_links_md: str) -> str:
    return f"""# Perfecto Homes Realty — Blog Post Content Engine

You write SEO/GEO/AEO-optimized blog posts for perfectohomesrealestate.com. Your ONLY output is a single blog post markdown file with YAML frontmatter. Do NOT generate LinkedIn, Facebook, or Instagram posts — those are separate flows.

## About Perfecto Homes

- Cusco and Sacred Valley, Peru property: homes, land and hospitality
- Elisban (Peruvian-born family property representative), Alfredo (Peru listings), Jamil (marketing and operations)
- Phone: (916) 878-7260, Email: perfectohomes@gmail.com
- Website: https://www.perfectohomesrealestate.com
- Areas: Cusco (Centro Histórico, San Blas, Wanchaq, San Sebastián, San Jerónimo) and the Sacred Valley (Ollantaytambo, Urubamba, Pisac, Chinchero, Calca, Yucay, Maras, Aguas Calientes)
- Bilingual English / Spanish, family-first approach, on-the-ground in Peru

## Voice Rules (MUST follow)

- Third-person brand voice OR first-person from Perfecto team where appropriate. Warm, confident, family-first.
- Short punchy sentences. Vary length.
- NO hyphens or em dashes. Use "to" for ranges: "5 to 10 days".
- NO AI filler phrases: "in today's world", "whether you're", "let's dive in", "in conclusion", "when it comes to", "first and foremost", "at the end of the day", "navigating".
- NO emojis in the blog body.
- Max 1 exclamation mark in the entire blog.
- Active voice always. Specific beats vague.
- NEVER use "click here" or "learn more" as link anchor text.

## Output Format (REQUIRED)

Output a single markdown file. Start IMMEDIATELY with YAML frontmatter (do NOT wrap in ```markdown or ```yaml):

---
title: "..." (20-60 chars, keyword in first 5 words)
metaTitle: "... (2026)" (20-60 chars, ends with year)
metaDescription: "..." (80-155 chars, include keyword + phone (916) 878-7260)
slug: "..." (3-6 lowercase hyphenated words)
date: "YYYY-MM-DD"
image: "/images/blog/library/peru-sacred-valley.jpg"
imageAlt: "..." (10-125 chars, keyword + description)
category: "Peru" OR "Market News" OR "Buying" OR "Investment"
author: "elisban" OR "gina" OR "alfredo" OR "jamil"
tags: ["tag1", "tag2", "tag3"]
language: "en"
featured: false
draft: false
quickAnswer: "..." (40-300 chars, direct answer, no Yes/No/Well start)
keyTakeaways:
  - "..." (3-5 items, 10-25 words each, at least 1 with specific number)
  - "..."
faq:
  - question: "..."
    answer: "..." (3-5 items, answers under 300 chars, self-contained)
---

[Body content below. 800-1500 words. 5-10 H2 headings as questions.]

## Body Requirements (HARD RULES — violating means rejection)

- Word count: 800 to 1500 words
- H2 headings: 5 to 10 (frame as questions, keyword in 2+)
- Internal links: minimum 3, descriptive anchors only
- Include at least 1 specific market stat or government data point (median price, days on market, mortgage rate, etc. — cite source)
- Include at least 3 specific Cusco or Sacred Valley locations
- Include a price transparency element (specific dollar ranges, % figures, comp data)
- For Peru-focused posts: include foreign-buyer-specific guidance
- For bilingual-focused posts: include Spanish title alternates if relevant
- End with CTA containing phone (916) 878-7260

## First-Party Authority Block (REQUIRED — include at least 2 in body)

- "Perfecto Homes represents family-held property in Cusco and the Sacred Valley"
- "Our team is fully bilingual English / Spanish and walks foreign buyers through every step of the Peruvian process"
- "Sacred Valley Peru listings are vetted in-person by Perfecto team members based in Urubamba and Ollantaytambo"
- "Peru property transactions for foreigners must be conducted through a notario público, with title insurance via SUNARP"

## Outbound Authority Links (REQUIRED — minimum 2 outbound .gov or .org links)

- Federal Reserve mortgage rates: https://www.federalreserve.gov/
- SUNARP Peru (Registro Predial): https://www.sunarp.gob.pe/
- Peru Ministry of Housing: https://www.gob.pe/vivienda
- NAR Realtor: https://www.nar.realtor/

Format: [descriptive anchor text](URL). Specific anchors, never "click here".

## Internal Link Library (use 3-5 from this list — these are LIVE published pages)

{internal_links_md}

Format: [descriptive anchor text](URL). Anchor text must be specific.

## IMAGE OPTIONS (pick one that matches topic)

- /images/blog/library/peru-sacred-valley.jpg — Sacred Valley, Urubamba, general Peru content
- /images/blog/library/peru-buying-process.jpg — Peru property buying process
- /images/blog/library/peru-chinchero-airport.jpg — Chinchero airport, Peru infrastructure
- /images/blog/library/peru-hospitality.jpg — Peru hospitality, hostal investment
- /images/blog/library/news-rates.jpg — interest rates, financing news
- /images/blog/library/news-inventory.jpg — inventory levels, market supply
- /images/blog/library/news-affordability.jpg — affordability crisis, housing policy

## Self-Check Before Outputting

Verify every rule above. If any fail, fix before returning. Your ENTIRE output is just the blog markdown file starting with --- and ending with the final CTA. Nothing else."""


def build_user_prompt(keyword: str, category: str, source: str) -> str:
    today = datetime.now().strftime("%Y-%m-%d")
    return f"""Today's date is {today}.

TARGETED KEYWORD: {keyword}
CONTENT CATEGORY: {category}
KEYWORD SOURCE: {source}

Write a comprehensive blog post targeting this keyword for Perfecto Homes serving Cusco and the Sacred Valley, Peru. Apply all voice rules, schema requirements, internal link library, and first-party authority block from the system prompt.

Output only the blog post markdown file starting with --- YAML frontmatter. No other deliverables."""


def call_gemini(system_prompt: str, user_prompt: str, api_key: str) -> str:
    body = {
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8192},
    }
    url = f"{GEMINI_URL}?key={api_key}"
    data = json.dumps(body).encode()
    last_err = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                url, data=data, headers={"Content-Type": "application/json"}, method="POST"
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                payload = json.loads(resp.read())
                return payload["candidates"][0]["content"]["parts"][0]["text"]
        except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError) as e:
            last_err = e
            print(f"Gemini attempt {attempt + 1} failed: {e}", file=sys.stderr)
            if attempt < 2:
                time.sleep(30)
    raise RuntimeError(f"Gemini failed after 3 attempts: {last_err}")


def extract_frontmatter_field(fm: str, name: str) -> str:
    m = re.search(rf'^{name}:\s*"([^"]+)"', fm, re.MULTILINE)
    return m.group(1) if m else ""


def validate_and_extract(text: str) -> tuple[str, str]:
    """Strip code fences, validate basic frontmatter rules, return (slug, text)."""
    text = re.sub(r"^```(?:yaml|markdown|md)?\n", "", text.strip())
    text = re.sub(r"\n```\s*$", "", text)

    fm_match = re.match(r"^---\n([\s\S]*?)\n---", text)
    if not fm_match:
        raise ValueError("Output missing YAML frontmatter")

    fm = fm_match.group(1)
    body = text[len(fm_match.group(0)):].strip()

    required = ["title", "slug", "date", "language", "quickAnswer"]
    missing = [r for r in required if not extract_frontmatter_field(fm, r)]
    if missing:
        raise ValueError(f"Missing required frontmatter fields: {missing}")

    word_count = len(re.findall(r"\S+", body))
    if word_count < 500:
        raise ValueError(f"Body has only {word_count} words (need 500+)")

    h2_count = len(re.findall(r"^## ", body, re.MULTILINE))
    if h2_count < 3:
        raise ValueError(f"Only {h2_count} H2 headings (need 3+)")

    slug = extract_frontmatter_field(fm, "slug")
    if not slug:
        raise ValueError("No slug in frontmatter")

    print(f"Validation OK: {word_count} words, {h2_count} H2s, slug={slug}")
    return slug, text


def log_to_sheet(slug: str, title: str, category: str, source: str, status: str) -> None:
    """Append a row to the Perfecto Homes Content Tracker → posted_content_log tab.

    Silent no-op if GCP_SA_KEY_JSON env var is missing. We do NOT want a sheet
    failure to mark the run as failed — the blog post itself already committed.
    """
    sa_json = os.environ.get("GCP_SA_KEY_JSON")
    if not sa_json:
        print("(sheet log skipped: GCP_SA_KEY_JSON not set)")
        return
    try:
        import json as _json
        import gspread  # type: ignore
        from google.oauth2.service_account import Credentials  # type: ignore

        creds_info = _json.loads(sa_json)
        creds = Credentials.from_service_account_info(
            creds_info,
            scopes=["https://www.googleapis.com/auth/spreadsheets"],
        )
        gc = gspread.authorize(creds)
        ws = gc.open_by_key(SHEET_ID).worksheet(SHEET_TAB)
        row = [
            datetime.now().strftime("%Y-%m-%d %H:%M"),
            "blog",
            "blog",
            title,
            f"{SITE_BASE}/blog/{slug}/",
            category,
            slug,
            status,
        ]
        ws.append_row(row, value_input_option="USER_ENTERED")
        print(f"Logged to sheet: {slug}")
    except Exception as e:
        print(f"WARN: sheet log failed: {e}", file=sys.stderr)


def extract_title(content: str) -> str:
    m = re.search(r'^title:\s*"([^"]+)"', content, re.MULTILINE)
    return m.group(1) if m else ""


def already_posted_today() -> bool:
    today = datetime.now().strftime("%Y-%m-%d")
    for f in BLOG_DIR.glob("*.md"):
        if f'date: "{today}"' in f.read_text():
            print(f"Already posted today ({today}): {f.name}. Exiting cleanly.")
            return True
    return False


def main() -> int:
    if already_posted_today():
        return 0

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set", file=sys.stderr)
        return 2

    context = load_context()
    internal_links = load_internal_links()
    used = existing_slugs()

    keyword, source = pick_keyword(context, used)
    category = pick_category()
    print(f"Topic: {keyword!r} | source={source} | category={category}")

    system_prompt = build_system_prompt(internal_links)
    user_prompt = build_user_prompt(keyword, category, source)

    raw = call_gemini(system_prompt, user_prompt, api_key)
    slug, content = validate_and_extract(raw)

    date_str = datetime.now().strftime("%Y-%m-%d")
    final_slug = slug if slug not in used else f"{slug}-{date_str}"
    content = re.sub(r'slug:\s*"[^"]+"', f'slug: "{final_slug}"', content, count=1)
    content = re.sub(r'date:\s*"[^"]+"', f'date: "{date_str}"', content, count=1)

    out_path = BLOG_DIR / f"{final_slug}.md"
    out_path.write_text(content)
    print(f"WROTE: {out_path}")

    log_to_sheet(final_slug, extract_title(content), category, source, "published")
    return 0


if __name__ == "__main__":
    sys.exit(main())
