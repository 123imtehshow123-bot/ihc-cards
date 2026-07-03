#!/usr/bin/env node
// IHCBNSP — Ironheart Capital Brief News Social Post card renderer.
// Usage: node render.js <data.json> [output.png]
// data.json keys: kicker, stat, headline, body, date, accent?, statSize?,
//                 brand?, tag?, handle?, source?
// Output: 3200x3200 PNG. Default filename: card_<epoch>_<hex6>.png in repo root.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright-core');

const ACCENTS = { red: '#ff6b5e', green: '#3ddc84', blue: '#5aa2ff' };

async function main() {
  const dataPath = process.argv[2];
  if (!dataPath) {
    console.error('usage: node render.js <data.json> [output.png]');
    process.exit(1);
  }
  const d = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const outPath = process.argv[3] || path.join(
    repoRoot,
    `card_${Math.floor(Date.now() / 1000)}_${crypto.randomBytes(3).toString('hex')}.png`
  );

  const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const vars = {
    BRAND: esc(d.brand || 'IRONHEART CAPITAL'),
    TAG: esc(d.tag || 'MORNING NEWS BRIEF'),
    DATE: esc(d.date || ''),
    KICKER: esc(d.kicker || ''),
    STAT: esc(d.stat || ''),
    HEADLINE: esc(d.headline || ''),
    BODY: esc(d.body || ''),
    HANDLE: esc(d.handle || '@Ironheart_Cap'),
    SOURCE: esc(d.source || ''),
    ACCENT: ACCENTS[d.accent] || d.accent || ACCENTS.red,
    STAT_SIZE: String(d.statSize || 470),
  };

  let html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  for (const [k, v] of Object.entries(vars)) {
    html = html.split(`{{${k}}}`).join(v);
  }

  const tmpHtml = path.join(__dirname, '.render-tmp.html');
  fs.writeFileSync(tmpHtml, html);

  const browser = await chromium.launch({
    executablePath: process.env.IHC_CHROMIUM || '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--allow-file-access-from-files', '--force-color-profile=srgb'],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1600, height: 1600 },
      deviceScaleFactor: 2,
    });
    await page.goto('file://' + tmpHtml);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(
      Array.from(document.images).map(i => i.decode())
    ));
    await page.screenshot({ path: outPath });
  } finally {
    await browser.close();
    fs.unlinkSync(tmpHtml);
  }
  console.log(outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
