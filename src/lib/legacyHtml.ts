/**
 * Build-time cleanup for HTML copied from the live WordPress site.
 * - absolute site links → root-relative
 * - wrong internal paths → the real page
 * - links to pages that were never published → text kept, link removed
 * - JSON-LD <script> blocks → returned separately for <head>
 */

const ORIGIN = /https?:\/\/(?:www\.)?tiresizecalculator\.pro/g;

/** Internal paths used in legacy content that don't exist, mapped to the real page. */
export const LINK_FIXES: Record<string, string> = {
  '/wheel-offset-calculator/': '/wheel-offset/',
  '/what-is-wheel-offset/': '/what-is-wheel-offset-et/',
  '/guides/what-is-wheel-offset/': '/what-is-wheel-offset-et/',
  '/guides/wheel-offset-vs-backspacing/': '/wheel-offset-vs-backspacing/',
  '/guides/poke-flush-tucked/': '/poke-flush-tucked/',
  '/revolutions-per-mile-calculator/': '/tire-revolutions-per-mile-calculator/',
  '/tire-diameter-calculator/': '/',
};

/** Linked from legacy content but never published (404 on the live site). */
export const UNPUBLISHED_PATHS = [
  '/what-is-tire-revolutions-per-mile/',
  '/tire-rpm-odometer-accuracy/',
  '/how-tire-size-affects-rpm/',
  '/tire-rolling-circumference/',
  '/speedometer-error-after-tire-change/',
  '/how-to-fix-speedometer-error/',
  '/how-much-speedometer-error-is-legal/',
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function fixLinks(html: string): string {
  let out = html.replace(ORIGIN, '');
  for (const [from, to] of Object.entries(LINK_FIXES)) {
    out = out.replace(new RegExp(`href="${esc(from)}(#[^"]*)?"`, 'g'), (_m, hash = '') => `href="${to}${hash}"`);
  }
  for (const dead of UNPUBLISHED_PATHS) {
    // Block-level card links become <div>, inline links become <span>; attributes other than href are kept.
    out = out.replace(new RegExp(`<a([^>]*?)\\s+href="${esc(dead)}"([^>]*)>([\\s\\S]*?)</a>`, 'g'), (_m, pre: string, post: string, inner: string) => {
      const tag = /<(h\d|p|div)\b/.test(inner) ? 'div' : 'span';
      const attrs = `${pre}${post}`.replace(/\s+(target|rel)="[^"]*"/g, '');
      return `<${tag}${attrs}>${inner}</${tag}>`;
    });
  }
  return out;
}

export function extractJsonLd(html: string): { html: string; schema: Record<string, unknown>[] } {
  const schema: Record<string, unknown>[] = [];
  const stripped = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_m, json: string) => {
    schema.push(JSON.parse(fixLinks(json)));
    return '';
  });
  return { html: stripped, schema };
}

export function cleanLegacyHtml(html: string) {
  const { html: body, schema } = extractJsonLd(html);
  return { html: fixLinks(body), schema };
}

/** Legacy JS accordions (button.faq-q + div.faq-a) → native <details>, no script needed. */
export function faqToDetails(html: string): string {
  return html.replace(
    /<div class="faq-item">\s*<button class="faq-q"[^>]*>([\s\S]*?)<\/button>\s*<div class="faq-a">([\s\S]*?)<\/div>\s*<\/div>/g,
    '<details class="faq-item"><summary class="faq-q">$1</summary><div class="faq-a">$2</div></details>',
  );
}

/** FAQPage JSON-LD built from the questions actually shown on the page. */
export function faqSchemaFromHtml(html: string) {
  const mainEntity = [...html.matchAll(/<summary class="faq-q">([\s\S]*?)<\/summary>\s*<div class="faq-a">([\s\S]*?)<\/div>/g)].map(([, q, a]) => ({
    '@type': 'Question',
    name: q!.replace(/<[^>]+>/g, '').trim(),
    acceptedAnswer: { '@type': 'Answer', text: a!.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() },
  }));
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity };
}
