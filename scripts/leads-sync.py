#!/usr/bin/env python3
"""Sync Web3Forms lead emails into Gina's leads Google Sheet.

Connects to jamil@thereadyconsult.com via IMAP, finds new Web3Forms
submission emails for Gina (by subject), parses Name/Phone/Email/Message,
appends to Gina Notary Leads 2026 sheet, and tags the email with a
'Synced/GinaLeads' label so we don't process it twice.

Designed to be idempotent — safe to run on a cron every 15 minutes.
"""

import email
import imaplib
import json
import os
import re
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

IMAP_HOST = "imap.gmail.com"
IMAP_USER = "jamil@thereadyconsult.com"
GMAIL_LABEL = "Synced-PerfectoLeads"

SHEET_ID = "1A5KofMki3qn08iMEyj3TvpV8vG9y0VSw2zGg0s5IyZA"
SHEET_TAB = "Sheet1"

# Subjects we recognize as Perfecto Homes leads
SUBJECT_PATTERNS = [
    re.compile(r"Perfecto Homes", re.IGNORECASE),
    re.compile(r"perfectohomesrealestate", re.IGNORECASE),
]


def main() -> int:
    pw = os.environ.get("GMAIL_APP_PASSWORD")
    sa_json = os.environ.get("GCP_SA_KEY_JSON")
    if not pw or not sa_json:
        print("ERROR: GMAIL_APP_PASSWORD and GCP_SA_KEY_JSON must both be set", file=sys.stderr)
        return 2

    import gspread  # type: ignore
    from google.oauth2.service_account import Credentials  # type: ignore

    creds = Credentials.from_service_account_info(
        json.loads(sa_json),
        scopes=["https://www.googleapis.com/auth/spreadsheets"],
    )
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SHEET_ID)
    ws = sh.worksheet(SHEET_TAB)
    existing_rows = ws.get_all_values()
    existing_dates = {row[0] for row in existing_rows[1:] if row}  # dedup on Date column

    imap = imaplib.IMAP4_SSL(IMAP_HOST)
    try:
        imap.login(IMAP_USER, pw)
    except imaplib.IMAP4.error as e:
        print(f"ERROR: Gmail IMAP login failed: {e}", file=sys.stderr)
        return 3

    try:
        # Ensure label exists (Gmail folder in IMAP terms)
        typ, _ = imap.create(GMAIL_LABEL)
        # ALREADY_EXISTS is also fine

        imap.select('"[Gmail]/All Mail"')
        typ, data = imap.search(
            None,
            'FROM', '"notify@web3forms.com"',
            'NOT', 'X-GM-LABELS', GMAIL_LABEL,
            'SINCE', '01-Jan-2026',
        )
        if typ != "OK":
            print(f"ERROR: Gmail search failed: {data}", file=sys.stderr)
            return 4

        ids = data[0].split()
        print(f"Found {len(ids)} candidate emails to inspect")

        appended = 0
        skipped = 0
        for msg_id in ids:
            typ, msg_data = imap.fetch(msg_id, "(RFC822 X-GM-MSGID)")
            if typ != "OK":
                continue
            # msg_data is a list of tuples; the email body is at index 0 element 1
            raw = None
            for part in msg_data:
                if isinstance(part, tuple) and len(part) >= 2:
                    raw = part[1]
                    break
            if not raw:
                continue
            msg = email.message_from_bytes(raw)
            subject = msg.get("Subject", "")
            if not any(p.search(subject) for p in SUBJECT_PATTERNS):
                continue  # not a Gina lead

            date_hdr = msg.get("Date", "")
            try:
                dt = parsedate_to_datetime(date_hdr).astimezone(timezone.utc)
                date_str = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            except Exception:
                date_str = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

            if date_str in existing_dates:
                skipped += 1
                _label(imap, msg_id, GMAIL_LABEL)
                continue

            body = _extract_body(msg)
            fields = _parse_web3forms_body(body)
            row = [
                date_str,
                fields.get("name", ""),
                fields.get("phone", ""),
                fields.get("email", ""),
                fields.get("message", ""),
            ]
            ws.append_row(row, value_input_option="USER_ENTERED")
            existing_dates.add(date_str)
            _label(imap, msg_id, GMAIL_LABEL)
            appended += 1
            print(f"Appended: {row[1]!r} <{row[3]}> @ {date_str}")

        print(f"Done. Appended {appended}, skipped {skipped} (already in sheet).")
        return 0
    finally:
        try:
            imap.logout()
        except Exception:
            pass


def _label(imap, msg_id, label):
    """Apply a Gmail label using IMAP X-GM-LABELS."""
    try:
        imap.store(msg_id, "+X-GM-LABELS", label)
    except Exception as e:
        print(f"WARN: could not label {msg_id!r}: {e}", file=sys.stderr)


def _extract_body(msg) -> str:
    """Get plain-text body from a multipart email."""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    return part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace")
                except Exception:
                    return part.get_payload(decode=True).decode("utf-8", errors="replace")
        # Fallback: any text
        for part in msg.walk():
            if part.get_content_type().startswith("text/"):
                return part.get_payload(decode=True).decode("utf-8", errors="replace")
    else:
        try:
            return msg.get_payload(decode=True).decode(msg.get_content_charset() or "utf-8", errors="replace")
        except Exception:
            return msg.get_payload(decode=True).decode("utf-8", errors="replace")
    return ""


# Web3Forms plaintext body format is one field per line:
#   name  : Jamil Gonzales
#   phone  : 5034106881
#   email  : foo@bar.com
#   service  : Mobile Notary
#   message  : TEST

FIELD_ALIASES = {
    "name": ["name", "full name", "first-name", "first name", "fullname"],
    "email": ["email", "e-mail"],
    "phone": ["phone", "phone number", "phone-number", "phonenumber"],
    "message": ["message", "notes", "details", "how can we help", "comments"],
}


def _parse_web3forms_body(body: str) -> dict:
    """Parse Web3Forms plaintext body. Each line is 'label : value'."""
    fields = {}
    for line in body.splitlines():
        if ":" not in line:
            continue
        label, _, value = line.partition(":")
        label = label.strip().lower()
        value = value.strip()
        if not label or not value:
            continue
        for key, aliases in FIELD_ALIASES.items():
            if label in aliases:
                fields[key] = value
                break
    return fields


if __name__ == "__main__":
    sys.exit(main())
