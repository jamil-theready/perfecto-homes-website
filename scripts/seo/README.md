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
4. Use the primary control below within the client's existing publication
   authorization. The workflow's live enabled/disabled state is the authoritative
   switch. `TRC_SEO_ACTIVE` remains an additional startup brake. The runtime reads
   only the workflow-state API with its existing Actions-read token; it does not
   need a Variables-read secret or new GitHub App permissions. Missing, inactive,
   unreadable, wrong-repository or wrong-workflow evidence fails closed. Verify
   the actual hosted token can read the workflow state before accepting enrollment.
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

The GitHub `SEO Autopilot` workflow's enabled/disabled state is the one primary
publishing switch. Operate it with the current client's policy and the existing
operator `gh` authentication, from the website repository:

```bash
python3 scripts/seo/control.py --client perfecto --repo jamil-theready/perfecto-homes-website status
python3 scripts/seo/control.py --client perfecto --repo jamil-theready/perfecto-homes-website off
python3 scripts/seo/control.py --client perfecto --repo jamil-theready/perfecto-homes-website on
```

Replace both explicit identifiers for another client. A client/repository mismatch
is rejected before any API operation. Off disables the workflow first, sets the
legacy startup variable false and cancels its queued/running jobs. Every writer
push/direct deployment rechecks the current workflow state, so a stale true
startup snapshot cannot authorize an Off client. On cancels old nonterminal jobs,
sets the startup variable true and enables the workflow; it does not dispatch or
reset a monthly claim. Calling On when already On leaves valid running work alone.
A failure updating the legacy brake still leaves the workflow disabled and attempts
the cancellations. A failure cancelling an old run prevents enabling it. Cancellation requests that
are still nonterminal also leave the workflow Off; rerun On after they finish.

Changing the variable alone is an additional startup stop, and is not the live
primary switch. Operator Off/On must use the helper. The independent daily cloud
monitor continues; recovery respects a disabled writer. This SEO switch does not
pause unrelated forms, messages, Ads or other clients. Disabled workflows have no
scheduled runs; an already executing job must fail its next live permission check.

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

## Launch handoff and read-only followup

The existing `trc register` entry in CLIENT.md is the source. The reusable setup
entry reads that file once, validates the current TRC-STATUS date and exact
TRC-SYSTEMS site/repository/Google/master-ledger bindings against the approved
repository policy, then creates one cloud handoff. It does not change lifecycle,
account access, scopes or credentials. For this pilot only:

```bash
python3 scripts/seo/enroll.py --client-file "/Users/admin/Desktop/Clients/Perfecto Homes/CLIENT.md"
python3 scripts/seo/enroll.py --client-file "/Users/admin/Desktop/Clients/Perfecto Homes/CLIENT.md" --apply
```

The first command checks and displays the exact safe handoff; the second uses
the existing client status connection and operator GitHub authentication. Only
a newly created durable handoff requests an initial hosted monthly cycle. An
ambiguous dispatch is inspected, never automatically repeated on another setup
invocation. Existing monthly claims still suppress duplicate model work. The
launch timestamp means this newly verified SEO enrollment, not the site's
original first publication. Other clients remain unenrolled.

The existing Cloud Worker schedules one read-only followup seven days after
handoff, with a fourteen-day deadline. It dispatches `mode=followup` with the
exact launch identity. This job has read-only repository permissions, no model
credential, and no content publication, form submission or monthly-state write.
It reads real Google/master evidence and the configured site checks, sends a
separate followup receipt, and saves an immutable private attempt artifact.
Google's delay means the early snapshot covers the available completed dates
after handoff; it does not pretend to contain seven complete post-launch days
or prove an SEO effect. Missing account/history evidence stays partial/unknown.
The owner separately performs and verifies the approved actual form test.

Monthly recovery must exclude runs whose display title begins `SEO followup`;
a read-only followup never satisfies a missed monthly writer cycle. Future
scheduled execution remains pending until its real receipt is observed.
