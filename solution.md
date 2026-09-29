# solution.md — TireSizeCalculator.pro: WordPress/Elementor → Astro

Source of truth for the migration. `Ralph.md` tells the build agent how to work through the **Build Plan** below, one task at a time.

## 1. Goal

Rebuild https://tiresizecalculator.pro/ as a static **Astro** site, deployed later on **Vercel**, with:

- **Same functionality**: all 4 calculators produce identical numbers to the live site.
- **Same content**: text copied from the live pages.
- **Same URLs**: every live URL keeps its path, including the trailing slash.
- **Same brand**: current colors, fonts and logo.
- **Scope v1**: parity only. No new features, no ads, no new tools.

Repo: https://github.com/yasinzia01-ops/Tire-Size-Caclulator (public)

## 2. Live site inventory (from sitemap, 2026-09-29)

| URL | Type | Notes |
|---|---|---|
| `/` | Home + main Wheel & Tire Calculator | 14 content sections, FAQPage schema (8 Q&A) |
| `/speedometer-error-calculator/` | Calculator page | FAQPage schema |
| `/tire-revolutions-per-mile-calculator/` | Calculator page | Has its own inline schema |
| `/wheel-offset/` | Wheel Offset Calculator page | Inline FAQPage schema; whole page is one HTML widget |
| `/about-us/` | Page | |
| `/blog/` | Blog listing | 4 cards, category label + title + featured image |
| `/positive-negative-zero-offset/` | Post | Category: Wheel Offset Calculator |
| `/poke-flush-tucked/` | Post | 〃 |
| `/wheel-offset-vs-backspacing/` | Post | 〃 |
| `/what-is-wheel-offset-et/` | Post | 〃 |
| `/category/wheel-offset-calculator/` | Category archive | |
| `/privacy-policy/` | Page | |
| `/terms-condition/` | Page | Note: slug is `terms-condition` (keep it) |

**Navigation:** Calculators ▸ (Tire size Calculator) · About Us · Blog.
The other 3 calculators are **not** in the nav at the moment. Keep the nav identical for parity. Adding them to the Calculators dropdown is a one-line change if the owner wants it.

**Footer:** Privacy Policy · Terms & Condition · © 2026 Tiresizecalculator.pro

**Outbound references used in content:** nhtsa.gov/vehicle-safety/tires, sae.org, fueleconomy.gov/feg/maintain.jsp

## 3. Brand (extracted from Elementor kit + widget CSS)

**Fonts** (Google Fonts): headings **Poppins** 600/700/800 · body **Figtree** 400 · labels/cards **Barlow**, **Barlow Semi Condensed**, **Barlow Condensed** (700, uppercase).
Only load the weights actually used. The WP site loads every weight of every family.

**Colors:**

| Token | Hex | Where used |
|---|---|---|
| `--navy` | `#1A1F6E` | trust bar, glossary section, nav dropdown |
| `--navy-800` | `#262A75` | header/section backgrounds |
| `--navy-700` | `#1E2170` / `#241E63` | kit accents |
| `--red` | `#C0001A` | **header background**, primary brand red |
| `--red-600` | `#ED1C24` | category labels, highlights |
| `--red-900` | `#990026` | calculator "red" |
| `--pink-50` | `#F9E5E8` / `#EFDBDE` / `#FDF7F8` | tinted cards, label chips |
| `--gray-100` | `#F4F4F4` | card backgrounds |
| `--calc-blue` | `#0092CD` | calculator Wheel 1 |
| `--calc-gold` | `#CFB11F` | calculator accent |
| `--calc-green` | `#004225` | calculator Wheel 2 |
| `--calc-bg` / `--calc-border` | `#F8F9FA` / `#DCE4EC` | calculator panels |
| text | `#000000` / `#222222` / `#333333` | body / titles |

**Logo:** `_legacy/assets/logo-white.png` (508×250, white "TSC" mark + wordmark, shown on the **red** header). Footer bar is `#990026`. Headings: Barlow Condensed 900 uppercase; body: Barlow 15px `#666`; calculator: Poppins. Implemented in `src/styles/tokens.css`.
**Favicon:** `_legacy/assets/favicon-192.png`. Generate 32px, 180px (apple-touch) and 192px sizes from it.
**Images to download at build time (Phase 2):** hero/section images and the blog featured images under `/wp-content/uploads/2026/06/` and `/2026/07/`. Convert them to WebP/AVIF via `astro:assets`.

## 4. Calculators — port exactly, don't re-invent

The owner built these as plain HTML/CSS with an inline `<script>` in Elementor HTML widgets. The originals are archived verbatim in `_legacy/calculators/`:

| File | Live page |
|---|---|
| `home-wheel-tire-calculator.html` | `/` (#calculate) |
| `speedometer-error-calculator.html` | `/speedometer-error-calculator/` |
| `tire-revolutions-per-mile-calculator.html` | `/tire-revolutions-per-mile-calculator/` |
| `wheel-offset-calculator.html` | `/wheel-offset/` |

### Home calculator formulas (from the legacy script; keep as-is)

```
totalDia (mm) = rimDia_in × 25.4 + 2 × (tireW × profile / 100)
circumference = totalDia × π
poke  (mm)    = rimWidth_in × 25.4 / 2 − ET
inset (mm)    = rimWidth_in × 25.4 / 2 + ET
speedo error% = (new.dia − base.dia) / base.dia × 100      ← CORRECTED (see note below)
reading @30   = 30 × new.dia / base.dia                    (true speed when speedo shows 30; same for 60 mph / 100 km/h)
ride height   = |new.dia − base.dia| / 2   ("Gain" if larger, "Drop" if smaller)
ideal rim     = (tireW × 0.7 / 25.4)" – (tireW × 0.9 / 25.4)"
```

Features that must survive: Wheel 1 vs Wheel 2, **+ Add Wheel** / remove wheel (re-indexing), metric/imperial toggle for the specs table, SVG **Side View Profile** and **Front View (Offset/Poke)** diagrams, results table with diffs.

> ✅ **Speedo error formula decided (owner, 2026-09-29): use `(New − Original) ÷ Original × 100` everywhere.**
> The legacy home tool computed `(Original − New) ÷ Original`, which is the only place with the flipped sign. The correct convention is used by:
> - the speedometer error calculator (`err=(nc-oc)/oc*100`),
> - the revs-per-mile calculator (`(t2.circ − t1.circ) / t1.circ`),
> - the formula printed in the home/about content,
> - the home tool's own "reading @60" column.
>
> With this convention, a positive result means a bigger tire and true speed higher than indicated (the speedo reads low).
> **Related accuracy fixes (same owner decision):**
> - Revs-per-mile tool: "Actual speed when speedo shows 60 mph" was `60 ÷ (1 + err)`, which is inverted (it said a bigger tire is *slower*). Now it is `60 × (1 + err)`.
> - Revs-per-mile reference table: it is now computed from the same formula. The live table had 215/55R17 = 27.3" (really 26.3") and 235/35R19 = 26.3" (really 25.5"). Other rows differ by ≤1 in the last digit.
>
> These are the **only intentional deviations** from the live numbers. The golden test for the home calculator must assert the corrected sign, and every other output must still match the legacy tool.

### Porting approach
1. Move each calculator's math into a **pure TS module** (`src/lib/calc/*.ts`) with no DOM access.
2. Add **Vitest golden tests**: run the legacy script's formulas on 10+ sample sizes (e.g. 205/55R16 ET45 7", 225/45R17 ET40 7.5", 265/70R17, 285/75R17) and assert the new module matches to the displayed precision.
3. Keep each calculator's UI as an Astro component with a plain `<script>` (vanilla TS, no framework). Scope the legacy CSS to the component and remap the colors to brand tokens.
4. Keep the element IDs the content links to (`#calculate`).

## 5. Tech stack

| Concern | Choice |
|---|---|
| Framework | Astro 7 (7.3.5), static output, TypeScript 6 (pinned: @astrojs/check needs ≤6) |
| Styling | Plain CSS with custom properties (brand tokens in `src/styles/tokens.css`), component-scoped styles. No Tailwind, because the legacy CSS ports straight over |
| Interactivity | Vanilla TS `<script>` in Astro components (no React/Preact needed) |
| Content | Content collections: `src/content/posts/*.md` (4 posts), pages as `.astro` |
| Images | `astro:assets` (`<Image />`), originals in `src/assets/` |
| Fonts | Self-hosted via `@fontsource/*` (Poppins, Figtree, Barlow family), subset weights |
| SEO | `@astrojs/sitemap`, custom `<Seo />` head component, JSON-LD per page |
| Tests | Vitest (calculator math) |
| Package manager | npm |
| Node | 20 LTS or newer |
| Hosting | Vercel (static). Adapter not required |

`astro.config.mjs` essentials:
```js
site: 'https://tiresizecalculator.pro',
trailingSlash: 'always',
build: { format: 'directory' },
integrations: [sitemap()],
```

## 6. Project structure

```
/
├─ _legacy/                 # archived WP widget source + brand assets (reference only, not built)
├─ public/                  # favicon, robots.txt
├─ src/
│  ├─ assets/               # logo, images (optimized by astro:assets)
│  ├─ components/
│  │  ├─ Header.astro  Footer.astro  Seo.astro  Faq.astro  Breadcrumbs.astro
│  │  └─ calculators/  WheelTireCalculator.astro  SpeedoCalculator.astro
│  │                   RevsPerMileCalculator.astro  WheelOffsetCalculator.astro
│  ├─ content/posts/        # 4 blog posts (.md)
│  ├─ content.config.ts
│  ├─ layouts/  BaseLayout.astro  PostLayout.astro
│  ├─ lib/calc/             # pure calculator math (+ *.test.ts)
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ speedometer-error-calculator.astro
│  │  ├─ tire-revolutions-per-mile-calculator.astro
│  │  ├─ wheel-offset.astro
│  │  ├─ about-us.astro  privacy-policy.astro  terms-condition.astro
│  │  ├─ blog/index.astro
│  │  ├─ [slug].astro              # posts at root: /poke-flush-tucked/ etc.
│  │  └─ category/[category].astro
│  └─ styles/  tokens.css  global.css
├─ astro.config.mjs  package.json  tsconfig.json  vercel.json
├─ Ralph.md  solution.md  README.md
```

## 7. Layout (current design, cleaned up)

Keep the current look and section order. Only make these quality fixes, which don't change the design:
- Remove the jQuery, Elementor, ElementsKit and EAEL runtime. The target is zero JS except the calculator scripts.
- Calculator on mobile: stack the wheel input cards, make the results table scroll horizontally inside its own container (not the page), and scale the SVG diagrams to the container width.
- Use one H1 per page (the home page currently outputs two `<title>` tags because the widget contains a full HTML document, so strip the inner `<html>/<head>/<title>`).
- Give every image width/height to prevent layout shift (CLS). Preload only the logo and the LCP (largest content) image.
- Make the FAQ accordion work without JS (`<details>/<summary>`).

## 8. SEO parity checklist

- [ ] Every URL in §2 returns 200 at the same path, with a trailing slash.
- [ ] `<title>` and meta description copied exactly from the live page (captured in §8a).
- [ ] Self-referencing canonical on every page. OG + Twitter tags with the site name and an image.
- [ ] JSON-LD: FAQPage on the 4 calculator pages (copy the live Q&A exactly), Article + BreadcrumbList on posts, Organization + WebSite on home.
- [ ] `sitemap-index.xml` generated. `robots.txt` points to it.
- [ ] `vercel.json` 301s: `/wp-sitemap.xml`, `/sitemap_index.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`, `/category-sitemap.xml` → `/sitemap-index.xml`. Also `/feed/` → `/blog/` and `/wp-admin` → `/`. Redirect any URL without a trailing slash to the slashed version (Vercel `trailingSlash: true`).
- [ ] Headings (H1–H3) and internal links match the live pages.
- [ ] Lighthouse: Performance ≥ 95, SEO 100, Accessibility ≥ 95 on mobile.
- [ ] Before the DNS cutover, crawl the live site and the Vercel preview and diff status codes, titles, H1s and canonicals.

### 8a. Captured titles/descriptions

| URL | Title | Meta description |
|---|---|---|
| `/` | Tire Size Calculator \| Free Tire Size Fitment Tool | Free tire size calculator. Compare sizes, check speedo error, wheel offset (ET), poke, inset & circumference for any car, truck or SUV. Instant results. |
| `/speedometer-error-calculator/` | Speedometer Error Calculator - Tire Size Calculator | Enter your original (OEM) tire size, then your new tire size. Hit Calculate to see exact error %, real speed at every indicated speed, and odometer drift. |
| `/tire-revolutions-per-mile-calculator/` | Tire Revolutions Per Mile Calculator \| RPM by Tire Size | Calculate tire revolutions per mile instantly. Enter any tire size and get exact RPM, compare OEM vs new tires, and see speedometer impact. |
| `/wheel-offset/` | Wheel Offset Calculator - Free ET, Poke & Backspacing Tool | Free wheel offset calculator. Enter your ET, width & tire size to instantly calculate poke, inset & backspacing. Works for all cars, trucks & SUVs. |
| `/about-us/` | About Us - Tire Size Calculator | Learn who builds TireSizeCalculator.pro, how our free tire size, speedometer error and wheel offset calculators work, and the sources behind them. *(new, owner-approved)* |
| `/blog/` | Blog - Tire Size Calculator | Guides on wheel offset, backspacing, poke and tire fitment: clear explanations to help you choose the right wheel and tire size. *(new; live has none)* |
| `/positive-negative-zero-offset/` | Positive vs Negative vs Zero Offset | A complete guide to all three offset types exact ET ranges, fitment effects, handling changes, and which offset is right for your vehicle. |
| `/poke-flush-tucked/` | Poke vs Flush vs Tucked | Three terms that describe exactly how far your wheel and tire sit relative to the fender lip and how offset controls each one. |
| `/wheel-offset-vs-backspacing/` | Wheel Offset vs Backspacing | Both measurements describe wheel position but they use different reference points and units. Here is exactly what separates them and how to convert between them. |
| `/what-is-wheel-offset-et/` | What is Wheel Offset (ET)? | The complete definition of wheel offset what ET means, how it is measured, and how every millimeter affects your wheel fitment. |
| `/category/wheel-offset-calculator/` | Wheel Offset Calculator - Tire Size Calculator | — |
| `/privacy-policy/` | Privacy Policy - Tire Size Calculator | How TireSizeCalculator.pro collects, uses and protects your information, including Google Analytics cookies, and the choices you have. *(new, owner-approved)* |
| `/terms-condition/` | Terms & Condition - Tire Size Calculator | The terms for using TireSizeCalculator.pro's free tire size and fitment calculators, including accuracy disclaimers and your responsibilities. *(new, owner-approved)* |

`/tire-revolutions-per-mile-calculator/` currently outputs **two** `<title>` and two meta descriptions (the widget's own plus Rank Math's). Use the widget's values (above) and emit only one.

## 9. Content migration

- Copy text from the live pages (the owner's decision). Keep the wording as it is, and convert it to Markdown/Astro with the same heading levels, lists, tables and links.
- The home page's size charts (by wheel size 15–20", by diameter 24–29") and the speedo-error table become typed data arrays in `src/data/*.ts`, rendered as tables.
- Rewrite internal links from absolute `https://tiresizecalculator.pro/...` to root-relative `/...`.
- Download every image from `/wp-content/uploads/` that the content uses into `src/assets/`, and write alt text wherever it is currently empty.

## 10. Owner decisions & open items

- ✅ Framework Astro, host Vercel (the owner deploys later). Not deployed yet.
- ✅ Content: copy from the live pages. ✅ Keep the brand colors and logo. ✅ Scope: parity only.
- ✅ No AdSense. ✅ **Keep Google Analytics** with the same tag `GT-MBT5TB3W` (owner, 2026-09-29). Add it as a plain `gtag.js` snippet in `BaseLayout` (async, production builds only) so historical data continues. This is the only third-party script allowed.
- ✅ Speedo error: use `(New − Original) ÷ Original` (see §4).
- ✅ About, Privacy and Terms: write new, distinct meta descriptions (done in §8a). Check that the Privacy Policy body mentions Google Analytics cookies.
- ℹ️ The wheel-offset calculator's browser `alert()` for empty fields is replaced by an inline message.
- ⚠️ **Broken internal links on the live site, fixed in the port** (`src/lib/legacyHtml.ts`): `/wheel-offset-calculator/`→`/wheel-offset/`, `/what-is-wheel-offset/` and `/guides/what-is-wheel-offset/`→`/what-is-wheel-offset-et/`, `/guides/poke-flush-tucked/`, `/guides/wheel-offset-vs-backspacing/`, `/revolutions-per-mile-calculator/`, `/tire-diameter-calculator/`→`/`. These paths also get 301s in `vercel.json` (task 3.2).
- ⚠️ **Linked but never published** (text kept, link removed; possible future articles): `/what-is-tire-revolutions-per-mile/`, `/tire-rpm-odometer-accuracy/`, `/how-tire-size-affects-rpm/`, `/tire-rolling-circumference/`, `/speedometer-error-after-tire-change/`, `/how-to-fix-speedometer-error/`, `/how-much-speedometer-error-is-legal/`.
- ℹ️ Posts are verbatim legacy HTML (`src/content/posts/*.html`) served by `src/pages/[slug].astro`, with metadata in `src/data/posts.ts`. `positive-negative-zero-offset` is bylined **Jake Harmon**; the others are bylined mike.themechanic. The live category archive layout was broken (huge gaps), so it has a clean card grid now.
- ⚠️ **Homepage content fixes (please review):**
  - Size charts (`src/data/tireCharts.ts`) are now computed. About 30 of 54 diameters on the live "by wheel size" chart were wrong (e.g. 225/35R19 listed 26.1", actually 25.2"), and the whole live 24" tab held 22–23" tires. The same tire sizes are kept, each placed in the group it really belongs to. Revert by replacing the functions with static lists.
  - "Speedo error at common tire size changes" was an empty box on the live site. It now shows a computed table of 5 size changes that the site already mentions.
  - The Fitment Guide card titled "iOS (Apple Books)" (a CMS slip) is now "What is Poke?".
  - Eyebrow labels ("Free Online Tool", "Fitment Guide" …) are styled text, not H2/H5 headings, so there is one H1 per page with a clean heading outline.
- ⚠️ **Calculator page content fixes (please review):**
  - Speedometer page: the worked example (205/55R16 → 225/50R17) said 25.98 in, 2,070 mm, +4.4%, 62.6 mph. It is really 25.86 in, 2,063 mm, +3.9%, 62.4 mph, which matches the calculator on the same page. The "by common size change" table had 7 wrong rows (e.g. 205/55R16→215/55R16 said +0.8%, really +1.7%). Both are now computed.
  - Speedometer page reuses the homepage FAQ, same as live (its FAQ schema was identical). Note that the FAQ intro text promises questions about MOT and fixing error that the FAQ doesn't contain.
  - RPM page: the live FAQPage schema listed 3 questions that were not the 6 shown on the page. The schema is now generated from the visible FAQ.
  - RPM page prose/tables were kept verbatim and not recomputed (e.g. "265/70R17 … 21% speedo error" is really ~27%). Worth a copy review.
- 🛑 **LAUNCH BLOCKERS (owner action needed):**
  - **Privacy Policy** is an AI template. The live page even shows the template's own instructions ("Important Next Steps… Would you like me to refine this document…"), which were removed in the port. It still says `[Insert Your Email Address Here]`: give a contact email (`src/content/legal/privacy-policy.md`).
  - **Terms & Condition** is word-for-word the Privacy Policy on the live site (kept identical for parity). It needs real terms (`src/content/legal/terms-condition.md`).
- ℹ️ About page = the same homepage sections as live. Its speedo table is computed (live had wrong signs, e.g. 205/55R16→235/40R18 "−1.8%", really +2.1%).
- ℹ️ GA4 `gtag.js` loads after the window `load` event (when the browser is idle), so it does not block rendering. Page views are still recorded.
- 🚫 **Never modify the live WordPress site** (no edits through connectors, MCP tools, wp-admin or the REST API). Only read from it by fetching public pages.
- Later (not v1): add the 3 extra calculators to the nav, shareable URL params, tire-code input, programmatic size-comparison pages.

## 11. Deployment (owner, later)

1. Vercel → Import the GitHub repo → Framework preset **Astro** → Build `npm run build` → Output `dist`.
2. Check the preview URL against §8.
3. Add the domain `tiresizecalculator.pro` (+ `www` redirect) in Vercel, then update DNS at the registrar.
4. Search Console: submit `/sitemap-index.xml` and watch Coverage for 2–4 weeks.
5. Keep WordPress available (not deleted) for 30 days as a rollback.

## 12. Build Plan (Ralph works through this top to bottom)

Mark `[x]` only when the task's **Done when** is verified.

### Phase 0 — Scaffold
- [x] **0.1** Scaffold Astro (minimal template, TS strict) in repo root. Add `.gitignore`, `astro.config.mjs` per §5, `@astrojs/sitemap`, Vitest. **Done when:** `npm run build` and `npm test` pass.
- [x] **0.2** Brand tokens + global CSS + self-hosted fonts (§3). **Done when:** a test page shows all tokens/fonts.
- [x] **0.3** `BaseLayout`, `Seo`, `Header` (logo + nav + mobile menu, no JS dependency beyond a tiny toggle), `Footer`. **Done when:** layout matches the live header/footer at 375px and 1280px.

### Phase 1 — Calculators (math first, then UI)
- [x] **1.1** `lib/calc/wheelTire.ts` + golden tests against the legacy formulas.
- [x] **1.2** `WheelTireCalculator.astro`: inputs, add/remove wheels, results, unit toggle, both SVG diagrams.
- [x] **1.3** `lib/calc/speedo.ts` + tests → `SpeedoCalculator.astro`.
- [x] **1.4** `lib/calc/revsPerMile.ts` + tests → `RevsPerMileCalculator.astro`.
- [x] **1.5** `lib/calc/wheelOffset.ts` + tests → `WheelOffsetCalculator.astro`.
**Done when (each):** tests pass, and the UI shows the same numbers as the live page for 3 manual sample inputs.

### Phase 2 — Pages & content
- [x] **2.1** Home page: all 14 sections in live order, chart data in `src/data/`, FAQ + JSON-LD.
- [x] **2.2** The 3 calculator pages with their full content + FAQ JSON-LD.
- [x] **2.3** Content collection + 4 posts + `PostLayout` (Article + Breadcrumb JSON-LD).
- [x] **2.4** `/blog/` listing (cards) + `/category/wheel-offset-calculator/`.
- [x] **2.5** About, Privacy, Terms.
- [x] **2.6** Images downloaded, optimized, alt text written.

### Phase 3 — SEO & polish
- [x] **3.1** Titles/descriptions/canonicals per §8a; OG image.
- [x] **3.2** `robots.txt`, sitemap, `vercel.json` redirects + `trailingSlash: true`.
- [x] **3.3** 404 page.
- [ ] **3.4** Link check (no broken internal links), one H1 per page, Lighthouse targets met.
  - Status 2026-09-29: `npm run verify` passes (13 URLs, 1 H1 each, canonicals, no broken internal links). Local Lighthouse mobile: SEO 100, Best Practices 100, Accessibility 96, CLS ≤ 0.004. Performance 76–86 is **not reliable here**: this PC's Lighthouse CPU benchmark is 600–1,100 and swings between runs. **Re-measure with PageSpeed Insights on the Vercel preview** before ticking.
  - Accessibility: the only failures are colour contrast in brand colours (e.g. `#ED1C24` on white = 4.38:1, just under 4.5:1). The live site has the same. Kept for brand parity; darkening the red slightly would fix it.
- [x] **3.5** README: run/build/deploy instructions.
