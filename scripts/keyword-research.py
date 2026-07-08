#!/usr/bin/env python3
"""GSC keyword research for Perfecto Homes.

Pulls the last 90 days of Search Console queries, scores opportunities
(impressions weighted by position band), and refreshes the
`opportunityQueries` block in .seo/context.json. Strategic priorities,
listings, and overrides are left untouched — those are edited by hand.

Runs in GitHub Actions (GOOGLE_CREDENTIALS_JSON env var) or locally
(~/.config/website-automation/google-credentials.json). Uses a curl
fallback for the OAuth token exchange because macOS system Python's
LibreSSL cannot reach oauth2.googleapis.com.
"""

import base64
import json
import os
import subprocess
import sys
import time
import urllib.request
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTEXT_PATH = ROOT / ".seo" / "context.json"
SITE = "https://www.perfectohomesrealestate.com/"
SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"

PERU_TERMS = ("peru", "cusco", "sacred valley", "ollantaytambo", "urubamba",
              "lima", "chinchero", "san blas", "machu picchu")


def load_credentials() -> dict:
    # GCP_SA_KEY_JSON is the existing repo secret used by daily-blog.py —
    # accept it first so this script works in the same Actions environment.
    raw = os.environ.get("GCP_SA_KEY_JSON") or os.environ.get("GOOGLE_CREDENTIALS_JSON")
    if raw:
        return json.loads(raw)
    local = Path.home() / ".config/website-automation/google-credentials.json"
    return json.loads(local.read_text())


def get_token(info: dict) -> str:
    from google.auth import crypt  # google-auth only used for RSA signing (offline)

    signer = crypt.RSASigner.from_service_account_info(info)
    now = int(time.time())

    def b64(d: dict) -> bytes:
        return base64.urlsafe_b64encode(json.dumps(d).encode()).rstrip(b"=")

    payload = {"iss": info["client_email"], "scope": SCOPE,
               "aud": "https://oauth2.googleapis.com/token",
               "iat": now, "exp": now + 3600}
    signing_input = b64({"alg": "RS256", "typ": "JWT"}) + b"." + b64(payload)
    sig = base64.urlsafe_b64encode(signer.sign(signing_input)).rstrip(b"=")
    assertion = (signing_input + b"." + sig).decode()

    body = ("grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer"
            f"&assertion={assertion}")
    try:
        req = urllib.request.Request("https://oauth2.googleapis.com/token",
                                     data=body.encode())
        resp = json.loads(urllib.request.urlopen(req).read())
    except Exception:
        out = subprocess.run(
            ["curl", "-s", "-X", "POST", "https://oauth2.googleapis.com/token",
             "-d", body], capture_output=True, text=True, check=True)
        resp = json.loads(out.stdout)
    return resp["access_token"]


def fetch_queries(token: str) -> list[dict]:
    end = date.today() - timedelta(days=1)
    start = end - timedelta(days=90)
    body = json.dumps({
        "startDate": start.isoformat(), "endDate": end.isoformat(),
        "dimensions": ["query"], "rowLimit": 250,
        "orderBy": [{"field": "impressions", "descending": True}],
    })
    url = ("https://searchconsole.googleapis.com/webmasters/v3/sites/"
           + urllib.request.quote(SITE, safe="") + "/searchAnalytics/query")
    try:
        req = urllib.request.Request(url, data=body.encode(), headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"})
        data = json.loads(urllib.request.urlopen(req).read())
    except Exception:
        out = subprocess.run(
            ["curl", "-s", "-X", "POST", url,
             "-H", f"Authorization: Bearer {token}",
             "-H", "Content-Type: application/json", "-d", body],
            capture_output=True, text=True, check=True)
        data = json.loads(out.stdout)
    return data.get("rows", [])


def score(row: dict) -> float:
    """Impressions weighted by how winnable the position is."""
    pos, imp = row["position"], row["impressions"]
    if pos < 4 or pos > 45 or imp < 2:
        return 0.0
    if pos <= 12:       # near miss — page 1 within reach
        factor = 1.0
    elif pos <= 25:     # page 2-3, strong candidate for a dedicated post
        factor = 0.7
    else:               # page 3+, needs a content cluster
        factor = 0.4
    return imp * factor


def is_junk(q: str) -> bool:
    q = q.strip()
    if not q:
        return True
    junk = ('"', "http", ".com")
    return any(t in q for t in junk) or q[0].isdigit()


def main() -> int:
    creds = load_credentials()
    token = get_token(creds)
    rows = fetch_queries(token)
    print(f"{len(rows)} queries fetched from GSC")

    scored = sorted(
        (r for r in rows if not is_junk(r["keys"][0]) and score(r) > 0),
        key=score, reverse=True)

    opportunities = []
    for r in scored[:20]:
        q = r["keys"][0]
        opportunities.append({
            "query": q,
            "position": round(r["position"], 1),
            "impressions": r["impressions"],
            "clicks": r["clicks"],
            "nearMiss": r["position"] <= 12,
            "market": "peru" if any(t in q for t in PERU_TERMS) else "sacramento",
        })

    # Peru first: daily-blog.py only consumes opportunityQueries[:10], and
    # Sacramento's raw impressions would otherwise fill all ten slots. Peru
    # listings are the business priority (Jamil 2026-07-08), so they lead.
    opportunities.sort(key=lambda o: o["market"] != "peru")

    context = json.loads(CONTEXT_PATH.read_text())
    context["opportunityQueries"] = opportunities
    context["updatedAt"] = date.today().isoformat()
    context["_gscRefresh"] = (
        f"opportunityQueries auto-refreshed from GSC on {date.today().isoformat()} "
        f"({len(rows)} raw queries, 90-day window). Do not hand-edit that block; "
        "run scripts/keyword-research.py instead.")
    CONTEXT_PATH.write_text(json.dumps(context, indent=2, ensure_ascii=False) + "\n")

    peru = sum(1 for o in opportunities if o["market"] == "peru")
    print(f"wrote {len(opportunities)} opportunities "
          f"({peru} peru, {len(opportunities) - peru} sacramento) to .seo/context.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
