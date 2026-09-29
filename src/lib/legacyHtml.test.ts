import { expect, test } from 'vitest';
import { cleanLegacyHtml, fixLinks } from './legacyHtml';

test('absolute links become relative, wrong paths are fixed', () => {
  expect(fixLinks('<a href="https://tiresizecalculator.pro/">x</a>')).toBe('<a href="/">x</a>');
  expect(fixLinks('<a href="https://tiresizecalculator.pro/wheel-offset-calculator/">x</a>')).toBe('<a href="/wheel-offset/">x</a>');
  expect(fixLinks('<a href="https://tiresizecalculator.pro/guides/poke-flush-tucked/">x</a>')).toBe('<a href="/poke-flush-tucked/">x</a>');
});

test('unpublished links are unwrapped', () => {
  expect(fixLinks('<p>see <a href="https://tiresizecalculator.pro/how-to-fix-speedometer-error/" target="_blank">fix it</a>.</p>')).toBe('<p>see <span>fix it</span>.</p>');
  expect(fixLinks('<a class="related-card" href="https://tiresizecalculator.pro/tire-rolling-circumference/"><h3>T</h3></a>')).toBe('<div class="related-card"><h3>T</h3></div>');
});

test('json-ld is extracted', () => {
  const r = cleanLegacyHtml('<script type="application/ld+json">{"@type":"FAQPage","url":"https://tiresizecalculator.pro/x/"}</script><p>a</p>');
  expect(r.html).toBe('<p>a</p>');
  expect(r.schema).toEqual([{ '@type': 'FAQPage', url: '/x/' }]);
});
