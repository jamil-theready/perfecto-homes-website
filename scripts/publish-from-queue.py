#!/usr/bin/env python3
"""Publish the oldest reviewed post from content-queue/ into content/blog/.

Content Day batch-generates posts into content-queue/ (ordered by numeric
prefix, e.g. 01-cusco-real-estate.md). On each scheduled publish run, this
script moves the first one into content/blog/ with today's date stamped in
the frontmatter, so posts drip out on the blog schedule.

Exit code 0 = a post was published. Exit code 1 = queue empty (the workflow
falls back to live generation via daily-blog.py).
"""

import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUEUE_DIR = ROOT / "content-queue"
BLOG_DIR = ROOT / "content" / "blog"


def main() -> int:
    if not QUEUE_DIR.is_dir():
        print("content-queue/ does not exist — queue empty")
        return 1
    # Only numbered queue files (01-slug.md) are publishable — never README etc.
    queued = sorted(QUEUE_DIR.glob("[0-9]*-*.md"))
    if not queued:
        print("no numbered posts in content-queue/ — queue empty")
        return 1

    src = queued[0]
    text = src.read_text()

    # Stamp today's date inside the frontmatter block only (never the body)
    today = date.today().isoformat()
    fm = re.match(r"\A---\n(.*?\n)---\n", text, flags=re.S)
    if fm:
        block = fm.group(1)
        if re.search(r"^date:", block, flags=re.M):
            new_block = re.sub(r"^date:\s*.*$", f'date: "{today}"', block,
                               count=1, flags=re.M)
        else:
            new_block = f'date: "{today}"\n' + block
        text = text.replace(fm.group(0), f"---\n{new_block}---\n", 1)
    else:
        print(f"ERROR: {src.name} has no frontmatter — fix it in the queue",
              file=sys.stderr)
        return 1

    # Strip the queue-ordering prefix (01-, 02-, ...) for the published filename
    name = re.sub(r"^\d+-", "", src.name)
    dest = BLOG_DIR / name
    if dest.exists():
        # Slug collision: publish under a -2/-3 suffix rather than jamming the
        # queue (exit 1 here would silently trigger live generation forever).
        stem = dest.stem
        for suffix in range(2, 10):
            dest = BLOG_DIR / f"{stem}-{suffix}.md"
            if not dest.exists():
                break
        print(f"WARN: slug collision, publishing as {dest.name}", file=sys.stderr)

    dest.write_text(text)
    src.unlink()
    print(f"published {dest.name} (dated {today}), {len(queued) - 1} left in queue")
    return 0


if __name__ == "__main__":
    sys.exit(main())
