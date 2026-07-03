# PAUL State

## Current phase
Claude-operator mode. The GitHub Actions + Twilio WhatsApp autoposter
(ihc-morning.yml / ihc-pipeline.yml, separate repo) is retired. Christopher
runs the workflow interactively through Claude Code sessions in this repo.

## Current stack
- This repo: card images (public host for Blotato), skills, state.
- `.claude/skills/ihcbnsp/` — branded card renderer (headless Chromium).
- `.claude/skills/ihc-operator/` — operator workflow: shortlist → pick →
  draft + card preview → GO → publish.
- Sourcing: WebSearch / Google News RSS, fresh crawl per shortlist.
- Publish targets: X/Twitter + Threads only, via Blotato. Instagram OFF.

## Known risks / open items
- Blotato publishing from Claude sessions is currently blocked, verified
  2026-07-03: (1) the environment's network policy denies
  `backend.blotato.com` (proxy CONNECT 403), and (2) no Blotato API key is
  present in the session (no env var, no connected tool). Fix without new
  services: in the Claude Code environment settings, allow the
  `backend.blotato.com` domain and add the existing Blotato API key as a
  secret env var (e.g. `BLOTATO_API_KEY`). Until then publishing is manual
  (Claude hands over the card URL + copy after GO).
- State (`state/*.json`) must be committed+pushed every time it changes;
  session containers are ephemeral.

## What not to touch
- GO approval gate, publish targets, duplicate protection, state files.
