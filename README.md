# TireSizeCalculator.pro

Astro rebuild of [tiresizecalculator.pro](https://tiresizecalculator.pro/) (previously WordPress + Elementor).
It is a static site with 4 calculators, 4 guides and the same URLs as the WordPress site. It is built to deploy on Vercel.

- **Plan, decisions and open items:** [`solution.md`](solution.md). Read §10 before launch.
- **How the build agent works:** [`Ralph.md`](Ralph.md)

## Requirements

- Node.js 20 or newer (developed on Node 24)
- npm

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Calculator math tests (checked against the original WordPress widgets) |
| `npm run check` | TypeScript / Astro checks |
| `npm run verify` | After a build: every live URL exists, one H1 per page, canonicals, no broken internal links |

Before every deploy, run `npm test && npm run build && npm run verify`.

## Where things live

| To change… | Edit |
|---|---|
| Header menu, footer links, GA ID | `src/data/site.ts` |
| Homepage text (features, steps, glossary, FAQ …) | `src/data/home.ts` |
| Blog post list (titles, descriptions, images, dates) | `src/data/posts.ts` |
| Blog post bodies | `src/content/posts/<slug>.html` |
| Privacy Policy / Terms | `src/content/legal/*.md` |
| RPM and Wheel Offset page text | `src/content/pages/*.html` |
| Speedometer Error page text | `src/pages/speedometer-error-calculator.astro` |
| Calculator formulas | `src/lib/calc/*.ts` (+ tests next to them) |
| Brand colours and fonts | `src/styles/tokens.css`, `src/styles/fonts.css` |
| Redirects and headers | `vercel.json` |

**Adding a blog post:** put the post HTML in `src/content/posts/<slug>.html`, add an image to `src/assets/images/`, and add an entry at the top of `POSTS` in `src/data/posts.ts`. The post is served at `/<slug>/` and appears on the homepage, `/blog/`, its category page and the sitemap.

## Deploy to Vercel

1. In Vercel, choose **Add New → Project**, import this GitHub repo, and pick the **Astro** framework preset.
   Build command `npm run build`, output directory `dist` (both are the preset defaults).
2. Open the preview URL and check it. Also run [PageSpeed Insights](https://pagespeed.web.dev/) on it.
3. **Settings → Domains:** add `tiresizecalculator.pro` and set `www` to redirect to it. Then update DNS at your registrar as Vercel instructs.
4. In Google Search Console, submit `https://tiresizecalculator.pro/sitemap-index.xml`.
5. Keep the WordPress site available (not deleted) for about 30 days in case you need to roll back.

The site is fully static, so no Vercel adapter or environment variables are needed.
