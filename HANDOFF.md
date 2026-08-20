# Handoff — ihc-cards / BN IHC posting workflow

Written 2026-08-20. Read this first, then `PAUL/state.md`.

## What this repo is

Public host for Ironheart Capital branded card images so Blotato can fetch
them by raw URL. Cards are committed to `main` as
`card_<epoch>_<hex6>.png` and served at:

```
https://raw.githubusercontent.com/123imtehshow123-bot/ihc-cards/main/<file>.png
```

## Context / history

Christopher previously ran a **WA BN IHC autoposter**: GitHub Actions cron
(`ihc-morning.yml` 7am/12pm/5pm Central + `ihc-pipeline.yml` catch-up
watchdog), Python scripts, Twilio WhatsApp relay for approvals, state in
`sent_slots.json` / `shown_stories.json`. That bot lives in a **different
repo** and is **retired** — GitHub cron was unreliable and the WhatsApp
sandbox 24-hour window kept breaking delivery. He also abandoned a mobile-app
attempt. He now wants to run the workflow **interactively through Claude
sessions**. He wants execution, not architecture debates.

## What was built in the last session

Branch: **`claude/ihcbnsp-meaning-frvrxp`** — 3 commits, pushed, NOT yet
merged to `main`. Merging matters: card URLs only resolve from `main`.

- `35916b9` PAUL state note
- `450fe94` `.claude/skills/ihc-operator/` — operator workflow skill
- `3c8ba1e` `.claude/skills/ihcbnsp/` — card renderer skill

### `ihcbnsp` skill — card renderer (working, verified)

Renders 3200x3200 branded cards matching the existing card design. Headless
Chromium at `/opt/pw-browsers/chromium` via `playwright-core`, self-hosted
fonts (Inter / Archivo Black / Oswald), phoenix logo extracted from the
original card and alpha-cleaned. Fully offline — no external service.

```bash
cd .claude/skills/ihcbnsp && [ -d node_modules ] || npm install
node .claude/skills/ihcbnsp/render.js data.json     # prints output path
```

`data.json`: `kicker`, `stat`, `headline`, `body`, `date` (M.D.YY),
`accent` (`red`/`green`/`blue`/hex), `source`; optional `statSize`
(default 470 — lower it for stats over ~4 chars), `tag`, `brand`, `handle`.
Verified by reproducing the existing WTI crude card.

### `ihc-operator` skill — the workflow

shortlist → pick number → draft + card preview → **GO** → publish.
State: `state/shown_stories.json` (freshness), `state/published.json`
(double-post protection). Both currently `{}` — nothing run through it yet.

## Rules that carry over (from Christopher's operator directions)

1. Publish targets are **X/Twitter + Threads only**. **Instagram OFF** — no
   IG code, 4:5 formats, or carousels without explicit approval.
2. **Never publish without an explicit `GO`.** Never double-post.
3. Fresh crawl per shortlist; never silently reuse an old list; if fewer
   than 10 fresh stories, say so.
4. No new services/schedulers/accounts/APIs (no QStash, cron-job.org,
   Healthchecks, Cloud Run, Telegram, Upstash).
5. Never print secrets. Never claim "Published ✓" unless verified.
6. Diagnose with evidence, smallest fix, verify, stop. Be concise.

## Open item — publishing (UNRESOLVED, needs verification)

Christopher states Blotato is connected and he posts from it daily — take
that as true. The unresolved question is only whether a **Claude session**
can trigger a publish, and the answer differs by where the session runs.

Evidence from the last session (cloud/web container):

- Outbound `https://backend.blotato.com` returned proxy `CONNECT 403`
  (policy denial) — twice. That environment's network policy did not allow
  the domain.
- No Blotato tool found via `ToolSearch`.
- 11 MCP connectors were listed as **unauthorized** (UUID names only, so
  one may have been Blotato). OAuth can't run in a non-interactive session.

**Next session should first re-check its own environment** rather than
assume the above still applies — a local Claude Code session, or a cloud
environment with the domain allowed, may reach Blotato fine. Check in this
order: (1) `ToolSearch` for a Blotato connector/tool; (2) `/mcp` to see if
a Blotato MCP server is present and authorize it; (3) direct API reach.

Paths to a working publish, cheapest first:
- **A.** Blotato connector authorized in the session → call it directly.
- **B.** `BLOTATO_API_KEY` as a secret env var + `backend.blotato.com`
  allowed in the environment's network policy → direct API call.
- **C.** Manual: Claude renders + pushes the card and hands over the URL
  and final copy; Christopher posts from the Blotato dashboard. Works today
  with zero setup.

**Security note:** a Blotato API key was pasted into the previous chat. It
was never written to any file or commit, and is not in this repo. It should
be **rotated** in Blotato, and the new key stored only as a secret env var —
never in chat.

## Suggested next steps

1. Merge `claude/ihcbnsp-meaning-frvrxp` → `main` so card URLs resolve.
2. Determine which publish path (A/B/C) is available in the new session.
3. Run one real cycle end to end: shortlist → pick → preview → GO → publish,
   and confirm the state files get written and pushed.
