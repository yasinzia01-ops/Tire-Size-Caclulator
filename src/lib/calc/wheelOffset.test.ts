import { describe, expect, test } from 'vitest';
import { offsetResult, type OffsetWheel } from './wheelOffset';

/** Verbatim legacy wocCalc() output logic, DOM removed. */
function legacy(sw: number, se: number, nw: number, ne: number) {
  const swMM = sw * 25.4, nwMM = nw * 25.4;
  const outerDiff = (nwMM / 2 - ne) - (swMM / 2 - se);
  const innerDiff = (nwMM / 2 + ne) - (swMM / 2 + se);
  const o = outerDiff > 0 ? ['+' + outerDiff.toFixed(1) + ' mm', 'red', 'More Poke — sticks out further']
    : outerDiff < 0 ? [outerDiff.toFixed(1) + ' mm', 'blue', 'More Tuck — sits further inward'] : ['0 mm', '', 'No change in outer position'];
  const i = innerDiff > 0 ? ['+' + innerDiff.toFixed(1) + ' mm', 'red', 'Less inner clearance vs stock']
    : innerDiff < 0 ? [innerDiff.toFixed(1) + ' mm', 'green', 'More inner clearance vs stock'] : ['0 mm', '', 'No inner clearance change'];
  const abs = Math.abs(outerDiff);
  const s = abs <= 10 ? ['Safe', 'green', 'Within ±10mm safe zone'] : abs <= 20 ? ['Caution', '', 'Check fender clearance'] : ['Risk', 'red', 'Fender work likely needed'];
  const dir = outerDiff >= 0 ? 'stick out <strong>' + Math.abs(outerDiff).toFixed(1) + 'mm more</strong>' : 'sit <strong>' + Math.abs(outerDiff).toFixed(1) + 'mm further inward</strong>';
  const ic = innerDiff > 0 ? '<strong>' + Math.abs(innerDiff).toFixed(1) + 'mm less</strong> inner clearance' : '<strong>' + Math.abs(innerDiff).toFixed(1) + 'mm more</strong> inner clearance';
  const safe = abs <= 10 ? 'This is within the safe range for most vehicles — no fender modification expected.'
    : abs <= 20 ? 'Check fender clearance before driving. Fender rolling may be required.'
    : 'Significant offset change — fender modification or aftermarket suspension is likely required.';
  return { o, i, s, v: '<strong>Result:</strong> Your new wheel will ' + dir + ' compared to stock. You will have ' + ic + '. ' + safe };
}

const CASES: [number, number, number, number][] = [
  [7.5, 48, 8.5, 35], // placeholders on the live page
  [7, 45, 7, 45],
  [8, 35, 8, 45],
  [7, 40, 9, 15],
  [6.5, 45, 7.5, 40],
  [8, 20, 10, -24],
  [9, 0, 8, 10],
];

describe('wheel offset matches legacy widget', () => {
  for (const [sw, se, nw, ne] of CASES) {
    test(`${sw}" ET${se} → ${nw}" ET${ne}`, () => {
      const stock: OffsetWheel = { width: sw, et: se }, next: OffsetWheel = { width: nw, et: ne };
      const r = offsetResult(stock, next);
      const ref = legacy(sw, se, nw, ne);
      expect([r.outer.value, r.outer.tone, r.outer.note]).toEqual(ref.o);
      expect([r.inner.value, r.inner.tone, r.inner.note]).toEqual(ref.i);
      expect([r.status.value, r.status.tone, r.status.note]).toEqual(ref.s);
      expect(r.verdictHtml).toBe(ref.v);
    });
  }
  test('7.5" ET48 → 8.5" ET35 = +25.7 mm poke, Risk', () => {
    const r = offsetResult({ width: 7.5, et: 48 }, { width: 8.5, et: 35 });
    expect(r.outer.value).toBe('+25.7 mm');
    expect(r.inner.value).toBe('-0.3 mm');
    expect(r.status.value).toBe('Risk');
  });
});
