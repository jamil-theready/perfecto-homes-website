#!/usr/bin/env python3
"""Post one Peru listing to the Perfecto Homes Facebook page.

Runs from .github/workflows/peru-fb-posts.yml on a Tue/Fri hourly cron
(12:00-16:00 UTC). The script itself decides whether this run should post,
so the schedule stays correct across EST/EDT changes:

  8 AM Eastern -> Siete Cuartones     10 AM Eastern -> Hostal Qhispicay
  9 AM Eastern -> Hatuchay Valle      11 AM Eastern -> Predio Victoria

Copy variant = (ISO week % 4) * 2 + (0 if Tuesday else 1), an 8-slot cycle
over 4 weeks so no post repeats within a month. Content lives in
fb-peru-posts.json (rebuild with automation/scripts/build-fb-posts-json.py
in the client folder).

Env:
  FB_PAGE_TOKEN_PERFECTO  required, page access token
  TEST_UNPUBLISHED=1      create the post unpublished (invisible to public)
  FORCE_SLOT=<0-7>        override the cycle slot (testing)
  FORCE_LISTING=<key>     override the listing (testing)
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

GRAPH = "https://graph.facebook.com/v25.0"
HOUR_TO_LISTING = {8: "siete-cuartones", 9: "hatuchay", 10: "qhispicay", 11: "predio-victoria"}
POSTING_DAYS = {1: 0, 4: 1}  # ISO weekday: Tuesday -> slot offset 0, Friday -> 1 (via .weekday(): Tue=1, Fri=4)

DATA = json.loads((Path(__file__).parent / "fb-peru-posts.json").read_text())
TOKEN = os.environ.get("FB_PAGE_TOKEN_PERFECTO")
if not TOKEN:
    sys.exit("ERROR: FB_PAGE_TOKEN_PERFECTO is not set")


def graph_post(path, params):
    params["access_token"] = TOKEN
    body = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(f"{GRAPH}/{path}", data=body, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"ERROR: Graph API {path} failed: {e.read().decode()}")


def main():
    now = datetime.now(ZoneInfo("America/New_York"))
    force_listing = os.environ.get("FORCE_LISTING") or ""
    force_slot = os.environ.get("FORCE_SLOT") or ""

    if force_listing or force_slot:
        listing_key = force_listing or "siete-cuartones"
        slot = int(force_slot or "0")
    else:
        if now.weekday() not in POSTING_DAYS:
            print(f"Not a posting day ({now:%A}), skipping.")
            return
        if now.hour not in HOUR_TO_LISTING:
            print(f"Hour {now.hour} ET is outside the 8-11 AM window (DST guard), skipping.")
            return
        listing_key = HOUR_TO_LISTING[now.hour]
        slot = (now.isocalendar().week % 4) * 2 + POSTING_DAYS[now.weekday()]

    listing = DATA["listings"][listing_key]
    post = listing["posts"][slot]
    unpublished = os.environ.get("TEST_UNPUBLISHED") == "1"
    page_id = DATA["page_id"]

    print(f"Posting {listing['name']} (slot {slot}, {len(post['photos'])} photos"
          f"{', UNPUBLISHED TEST' if unpublished else ''})")

    media = []
    for url in post["photos"]:
        result = graph_post(f"{page_id}/photos", {"url": url, "published": "false", "temporary": "true"})
        media.append({"media_fbid": result["id"]})

    params = {"message": post["message"]}
    for i, m in enumerate(media):
        params[f"attached_media[{i}]"] = json.dumps(m)
    if unpublished:
        params["published"] = "false"

    result = graph_post(f"{page_id}/feed", params)
    print(f"SUCCESS: post id {result['id']}")


if __name__ == "__main__":
    main()
