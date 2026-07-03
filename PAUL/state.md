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
- Blotato publishing from Claude sessions requires the Blotato connector to
  be authorized; until then publishing is manual (Claude hands over the card
  URL + copy).
- State (`state/*.json`) must be committed+pushed every time it changes;
  session containers are ephemeral.

## What not to touch
- GO approval gate, publish targets, duplicate protection, state files.
