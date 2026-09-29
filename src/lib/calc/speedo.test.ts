import { describe, expect, test } from 'vitest';
import { speedoResult, type TireSize } from './speedo';

/** Verbatim legacy speRunCalc() logic, DOM removed. */
function legacy(o: TireSize, n: TireSize) {
  function speCirc(w: number, a: number, r: number) { const sw = (a / 100) * w; const od = r + (2 * sw) / 25.4; return Math.PI * od * 25.4; }
  const oc = speCirc(o.w, o.a, o.r), nc = speCirc(n.w, n.a, n.r);
  const err = ((nc - oc) / oc) * 100;
  const factor = 1 + err / 100;
  let v: string;
  if (Math.abs(err) <= 3) v = '✓ Within safe ±3% limit';
  else if (Math.abs(err) <= 5) v = '⚠ Exceeds ±3% limit — consider recalibration';
  else v = '✗ Significant error — recalibration recommended';
  const rs = (ind: number) => (ind * factor).toFixed(1);
  const odo = (miles: number) => { const diff = (miles * err) / 100; return (diff >= 0 ? '+' : '') + diff.toFixed(0) + ' miles'; };
  return {
    pct: (err >= 0 ? '+' : '') + err.toFixed(1) + '%',
    v,
    speeds: [30, 50, 60, 70].map(rs),
    odo: [1000, 10000, 30000, 100000].map(odo),
  };
}

const t = (w: number, a: number, r: number): TireSize => ({ w, a, r });
const CASES: [TireSize, TireSize][] = [
  [t(205, 55, 16), t(225, 50, 17)], // live defaults
  [t(205, 55, 16), t(225, 45, 17)],
  [t(265, 70, 17), t(285, 75, 17)],
  [t(235, 45, 18), t(225, 45, 17)],
  [t(195, 65, 15), t(195, 65, 15)],
  [t(215, 60, 16), t(205, 55, 16)],
  [t(245, 40, 19), t(275, 35, 20)],
  [t(31, 10.5, 15), t(33, 12.5, 15)],
];

describe('speedo matches legacy widget', () => {
  for (const [o, n] of CASES) {
    test(`${o.w}/${o.a}R${o.r} → ${n.w}/${n.a}R${n.r}`, () => {
      const ours = speedoResult(o, n);
      const ref = legacy(o, n);
      expect(ours.errText).toBe(ref.pct);
      expect(ours.verdict.text).toBe(ref.v);
      expect(ours.speeds.map((s) => s.actual)).toEqual(ref.speeds);
      expect(ours.odometer.map((x) => x.text)).toEqual(ref.odo);
    });
  }
  test('live default 205/55R16 → 225/50R17', () => {
    const r = speedoResult(t(205, 55, 16), t(225, 50, 17));
    expect(r.errText).toBe('+3.9%');
    expect(r.verdict.level).toBe('warn');
  });
});
