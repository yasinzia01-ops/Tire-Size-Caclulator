import { expect, test } from 'vitest';
import { DIAMETER_TABS, WHEEL_TABS, diameterColumns, parseSize, sizeNotation, wheelSizeColumns } from './tireCharts';

test('notation', () => {
  expect(sizeNotation(parseSize('205/45R17'))).toBe('205/45R17 = 24.3×8.1R17');
  expect(sizeNotation(parseSize('255/40R17'))).toBe('255/40R17 = 25.0×10R17');
});

test('every size sits in the diameter tab it rounds to', () => {
  for (const d of DIAMETER_TABS) {
    for (const col of diameterColumns(d)) for (const l of col.items) expect(Math.round(parseSize(l).dia)).toBe(d);
  }
});

test('every tab has content', () => {
  for (const r of WHEEL_TABS) expect(wheelSizeColumns(r).length).toBe(2);
  for (const d of DIAMETER_TABS) expect(diameterColumns(d).length).toBeGreaterThan(0);
});

test('wheel columns are labelled with their true range', () => {
  for (const r of WHEEL_TABS) {
    for (const col of wheelSizeColumns(r)) {
      const m = col.heading.match(/^(\d+)"(?:–(\d+)")? Dia$/)!;
      const lo = Number(m[1]), hi = Number(m[2] ?? m[1]);
      for (const it of col.items) {
        const d = parseSize(it.split(' ')[0]!).dia;
        expect(d).toBeGreaterThanOrEqual(lo);
        expect(d).toBeLessThanOrEqual(hi + 1);
      }
    }
  }
});
