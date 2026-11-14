# Monthly SEO runner

This is a reusable repository-scoped runner for the existing GitHub Actions,
Google service account, Gemini research/writing and site publishing stack. It
adds no scheduler or paid provider. The monthly workflow runs on the first day
at 06:23 UTC. Recovery remains the existing agency service's responsibility.

## Enroll another client

1. Copy the workflow and `scripts/seo/` runtime/tests into that client's private
   website repository. Use `policy.example.json` as the starting `seo/policy.json`.
   Keep `enabled: false` until the current CLIENT.md and existing connections are
   verified. Each repository needs its own site, repo, market restrictions,
   allowed pages, source list, existing credential references and lead ledger.
2. Enroll only adapters matching that site's real file format. Existing editorial
   Markdown supports snippet/opening improvements and literal internal links.
   `next-static-metadata` supports a static exported Next `Metadata` object with
   double-quoted title/description strings. It preserves the page body,
   canonical, forms, schema and contact destinations. Dynamic expressions and
   other CMS formats are unsupported and must remain explicit partial coverage.
3. Verify Google read access to the exact GSC/GA4 property and canonical lead
   ledger with the existing service account. Configure the ledger source string,
   stable event identity, timezone and verified continuity boundary. Never infer
   historical completeness from the oldest row. Leave unverified dates null.
4. Set repository `TRC_SEO_ACTIVE` to true only within the client's existing
   publication authorization. The runner rechecks its latest value immediately
   before prepare and every push/direct deployment. Missing, false, unreadable,
   wrong-repository or disabled policy fails closed. Hosted read permission for
   the variables API must be proved; a local administrator token is not proof of
   the Actions token. The optional `SEO_VARIABLES_TOKEN` reference is not a
   request to create, copy or broaden any credential.
5. Run all Python tests, build the actual site for the enabled adapter, then run
   one hosted cycle and read the private `summary.md`, `audit.json`,
   `keyword-map.json`, `research.json`, `reporting.json` and result receipt.
   Only `Shipped and verified` confirms a selected change is live. A successful
   workflow with partial source coverage does not mean the full system passed.

## What the monthly cycle does

- Collects final GSC page/query rows and independent page totals for the latest
  completed 28-day window. Hidden Google queries are never external volume.
- Reads GA4 and the authoritative inquiry ledger for that window and the equal
  preceding period. It keeps search clicks, GA4 events, real inquiries and
  sales separate. Incomplete history is unknown, never a verified zero.
- Reviews existing articles, enrolled page metadata, approved internal link
  opportunities, configured indexing/canonical checks and public authority
  sources. The audit is limited to configured paths. Observed 404s are issues;
  unavailable reads or unsupported formats produce partial coverage.
- Improves existing content first. At most one checked release is selected per
  cycle, retaining the existing release interval and page cooldown. A new
  article requires verified uncovered demand, supported current sources,
  independent review and the existing media provenance rules. No demand is a
  valid no-change result. No forced article or invented keyword metrics.
- Builds before publishing, verifies exact served fields/links, and saves the
  baseline plus due 28/56-day reviews. Reviews due between monthly runs execute
  during the next monthly cycle. Robots/sitemaps are audited; automatic
  technical repairs, listing edits, schema changes and service-body rewriting
  are not implemented adapters.

## Pause, deduplication and resume

Use the existing per-client publishing control to set `TRC_SEO_ACTIVE` false.
It is checked live before each public mutation; the job's startup environment
is not the publication authority. A paused job performs no Google/model work.
Tests and an operational receipt may still run. This repository's SEO switch
does not pause unrelated forms, messages, Ads or other clients.

The workflow serializes runs per repository and checks out current main.
`seo/runner.json` is a private durable client/month claim, committed before the
first model call. Completed manual retries are deduplicated. Pausing never
resets a claim, so toggling Off/On cannot generate again for that month.

If Off or a deploy failure interrupts a checked draft, the always-uploaded
private artifact retains `checked-release.json`. A later manual run retrieves
that exact artifact and restores only allowlisted files with matching client,
repository, month, policy and source/content hashes. Every resume downloads the
original checked checkpoint, even when the draft already exists on main. A fixed
bounded allowlist retains the original search, audit, research, packet and review
evidence before replacement of a same-run artifact. Prior result/summary are
retained as previous-attempt files. It does not regenerate.
A changed policy/source, missing/expired artifact or failure before a checked
checkpoint blocks resume. Do not erase a claim to conceal a failure or force a
second model run. Repair the cause and review the exact pending result. Saved
no-change checkpoints can also complete without repeating research.

## Evidence and limits

`coverage_state: complete` means the configured review domains returned usable
evidence. `audit_issue_count` remains separate; a completed audit can find an
issue. It does not mean every site route was editable or every issue repaired.
The current Perfecto enrollment allows only the Peru community-index metadata
and fixed editorial links to approved community paths. Listings, held
properties, pricing, availability, lead routing, credentials and schema remain
outside writer mutations.

The receipt projects only aggregate metrics, coverage, safe URLs and edited
field names. Full diagnostics stay in the private execution artifact. Google
accepted-lead instrumentation needs its separate controlled proof; an event's
existence is not the authoritative inquiry count. No closed-sale source means
sales remain unknown.
