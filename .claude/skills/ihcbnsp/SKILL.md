---
name: ihcbnsp
description: >
  IHCBNSP — Ironheart Capital Brief News Social Post. Generate a branded
  3200x3200 news-brief card image (dark navy, big glowing stat, candlestick
  footer) in the Ironheart Capital style, save it to the repo root, and push
  it so Blotato can fetch the public raw URL. Use when asked to create an IHC
  card, morning news brief, market stat card, or a Blotato post image.
---

# IHCBNSP — Ironheart Capital Brief News Social Post

Renders a square (3200x3200) social card matching the Ironheart Capital
"Morning News Brief" design: dark navy background, brand header with the
phoenix logo, a huge glowing stat, a condensed uppercase headline, one line of
body copy, a faint candlestick band, and the handle/source footer.

## Steps

1. **Ensure dependencies** (one-time per machine):

   ```bash
   cd .claude/skills/ihcbnsp
   [ -d node_modules ] || npm install
   ```

   Rendering uses the pre-installed Chromium at `/opt/pw-browsers/chromium`
   (override with the `IHC_CHROMIUM` env var if it lives elsewhere).

2. **Write the card data** to a temp JSON file:

   ```json
   {
     "kicker": "WTI CRUDE",
     "stat": "$70",
     "headline": "HOLDS BELOW KEY LEVEL",
     "body": "Oil's quarterly drop is its biggest since the pandemic.",
     "date": "7.1.26",
     "accent": "red",
     "source": "ZeroHedge"
   }
   ```

   Field guide:
   - `kicker` — short uppercase topic label above the stat (e.g. ticker or asset).
   - `stat` — the hero number. Keep it short ("$70", "-14%", "4.2M").
   - `headline` — uppercase punchline under the stat, a few words.
   - `body` — one sentence of context. Keep it under ~90 characters.
   - `date` — `M.D.YY` format (e.g. `7.1.26`).
   - `accent` — `red` (bearish/down), `green` (bullish/up), `blue` (neutral),
     or any CSS hex color.
   - `source` — attribution shown as "Source: X | Not financial advice".
   - Optional: `statSize` (px, default 470 — drop to ~300 for stats longer
     than 4 characters so they don't overflow), `tag` (default
     "MORNING NEWS BRIEF"), `brand`, `handle`.

3. **Render**:

   ```bash
   node .claude/skills/ihcbnsp/render.js /path/to/data.json
   ```

   With no explicit output path it writes `card_<epoch>_<hex6>.png` to the
   repo root (the established naming convention) and prints the path.

4. **Verify** — view the generated PNG and check nothing overflows or wraps
   awkwardly (long stats need `statSize` reduced; long body copy should be
   shortened, not shrunk).

5. **Publish** — commit the PNG to the default branch and push. The public
   URL for Blotato is:

   ```
   https://raw.githubusercontent.com/123imtehshow123-bot/ihc-cards/main/<filename>.png
   ```

   Reply with that URL — it is the deliverable.

## Files

- `template.html` — card layout; `{{VARS}}` are substituted by the renderer.
- `render.js` — fills the template and screenshots it with headless Chromium
  (1600x1600 CSS viewport at deviceScaleFactor 2 → 3200x3200 PNG).
- `assets/logo.png` — transparent-background phoenix logo block.
- `assets/fonts/` — Inter (400/600/700/800), Archivo Black (stat), Oswald
  600/700 (headline), self-hosted so renders are deterministic and offline.
