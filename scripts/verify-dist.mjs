// Post-build checks: every live URL exists, one H1, title/description/canonical present,
// no broken internal links, no leftover absolute links to the old WordPress site.
// Run after `npm run build`:  npm run verify
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const SITE = 'https://tiresizecalculator.pro';
const LIVE_URLS = [
  '/', '/speedometer-error-calculator/', '/tire-revolutions-per-mile-calculator/', '/wheel-offset/', '/about-us/', '/blog/',
  '/privacy-policy/', '/terms-condition/', '/positive-negative-zero-offset/', '/poke-flush-tucked/',
  '/wheel-offset-vs-backspacing/', '/what-is-wheel-offset-et/', '/category/wheel-offset-calculator/',
];

const fileFor = (u) => path.join(DIST, u, 'index.html');
const exists = (u) => fs.existsSync(fileFor(u)) || fs.existsSync(path.join(DIST, u));

const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html') {
      const rel = path.relative(DIST, path.dirname(p)).split(path.sep).join('/');
      pages.push(rel ? `/${rel}/` : '/');
    }
  }
})(DIST);

let errors = 0;
const fail = (m) => {
  errors++;
  console.log('✗', m);
};

for (const u of LIVE_URLS) if (!exists(u)) fail(`missing live URL ${u}`);

const rows = [];
for (const u of pages) {
  const html = fs.readFileSync(fileFor(u), 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (!title) fail(`${u} no <title>`);
  if (!desc) fail(`${u} no meta description`);
  if (canon !== SITE + u) fail(`${u} canonical is ${canon}`);
  if (h1 !== 1) fail(`${u} has ${h1} <h1>`);

  const body = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '').replace(/<(link|meta)[^>]*>/g, '');
  if (/href="https?:\/\/(www\.)?tiresizecalculator\.pro/.test(body)) fail(`${u} has an absolute link to the old site`);

  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    if (href.startsWith('/_astro/') || /\.(png|jpe?g|xml|txt|ico|webp|css|svg)$/.test(href)) {
      if (!exists(href)) fail(`${u} → missing asset ${href}`);
    } else if (!href.endsWith('/')) fail(`${u} → link without trailing slash ${href}`);
    else if (!exists(href)) fail(`${u} → broken link ${href}`);
  }
  rows.push({ url: u, title, descLength: desc?.length ?? 0 });
}

console.table(rows);
console.log(errors ? `${errors} problem(s)` : `OK — ${pages.length} pages checked`);
process.exit(errors ? 1 : 0);
