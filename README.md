# ihc-cards
IHC rendered card images (public host for Blotato)

## IHCBNSP skill

`.claude/skills/ihcbnsp/` contains the **Ironheart Capital Brief News Social
Post** skill: ask Claude Code for an IHC news-brief card and it renders a
3200x3200 branded PNG (headless Chromium + self-hosted fonts), saves it here
as `card_<epoch>_<hex>.png`, and pushes it so Blotato can fetch
`https://raw.githubusercontent.com/123imtehshow123-bot/ihc-cards/main/<file>.png`.
