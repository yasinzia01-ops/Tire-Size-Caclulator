import { describe, expect, test } from 'vitest';
import { REFERENCE_SIZES, referenceRow, rpmResult } from './revsPerMile';
import type { TireSize } from './speedo';

/** Verbatim legacy getTireData()/calculate() string logic, DOM removed. */
function legacy(s1: TireSize, s2: TireSize) {
  const get = ({ w, a, r }: TireSize) => {
    const sidewall_mm = (a / 100) * w;
    const diameter_in = r + 2 * (sidewall_mm / 25.4);
    const circumference_in = Math.PI * diameter_in;
    return { diameter_in, circumference_in, rpm: 63360 / circumference_in };
  };
  const t1 = get(s1), t2 = get(s2);
  const diff = t2.rpm - t1.rpm;
  const speedoErr = ((t2.circumference_in - t1.circumference_in) / t1.circumference_in) * 100;
  return {
    t1Rpm: String(Math.round(t1.rpm)),
    t2Rpm: String(Math.round(t2.rpm)),
    diff: (diff >= 0 ? '+' : '') + Math.round(diff),
    t1Dia: t1.diameter_in.toFixed(2) + '"',
    t2Dia: t2.diameter_in.toFixed(2) + '"',
    speedo: (speedoErr >= 0 ? '+' : '') + speedoErr.toFixed(1) + '%',
    speedoErr,
  };
}

const t = (w: number, a: number, r: number): TireSize => ({ w, a, r });
const CASES: [TireSize, TireSize][] = [
  [t(205, 55, 16), t(215, 55, 16)], // live defaults
  [t(205, 55, 16), t(225, 45, 17)],
  [t(265, 70, 17), t(285, 75, 17)],
  [t(235, 45, 18), t(225, 45, 17)],
  [t(195, 65, 15), t(195, 65, 15)],
  [t(175, 65, 14), t(285, 75, 16)],
];

describe('revs per mile matches legacy widget', () => {
  for (const [a, b] of CASES) {
    test(`${a.w}/${a.a}R${a.r} → ${b.w}/${b.a}R${b.r}`, () => {
      const ours = rpmResult(a, b);
      const ref = legacy(a, b);
      expect(ours.t1Rpm).toBe(ref.t1Rpm);
      expect(ours.t2Rpm).toBe(ref.t2Rpm);
      expect(ours.diff.text).toBe(ref.diff);
      expect(ours.t1Dia).toBe(ref.t1Dia);
      expect(ours.t2Dia).toBe(ref.t2Dia);
      expect(ours.speedo.text).toBe(ref.speedo);
      // Corrected actual-speed formula.
      expect(ours.actual.text).toBe((60 * (1 + ref.speedoErr / 100)).toFixed(1) + ' mph');
    });
  }
  test('larger tire → actual speed above 60', () => {
    expect(rpmResult(t(205, 55, 16), t(225, 50, 17)).actual.text).toBe('62.4 mph');
  });
  test('205/55R16 ≈ 811 rev/mile (page copy says ~812)', () => {
    expect(rpmResult(t(205, 55, 16), t(205, 55, 16)).t1Rpm).toBe('811');
  });
});

describe('reference table', () => {
  test('computed rows', () => {
    expect(REFERENCE_SIZES.map(referenceRow)).toMatchInlineSnapshot(`
      [
        {
          "circ": "72.1",
          "dia": "23.0",
          "rpm": "879",
          "size": "175/65R14",
        },
        {
          "circ": "78.5",
          "dia": "25.0",
          "rpm": "807",
          "size": "195/65R15",
        },
        {
          "circ": "78.2",
          "dia": "24.9",
          "rpm": "811",
          "size": "205/55R16",
        },
        {
          "circ": "82.7",
          "dia": "26.3",
          "rpm": "767",
          "size": "215/55R17",
        },
        {
          "circ": "78.5",
          "dia": "25.0",
          "rpm": "808",
          "size": "225/45R17",
        },
        {
          "circ": "80.0",
          "dia": "25.5",
          "rpm": "792",
          "size": "235/35R19",
        },
        {
          "circ": "80.8",
          "dia": "25.7",
          "rpm": "784",
          "size": "245/40R18",
        },
        {
          "circ": "99.3",
          "dia": "31.6",
          "rpm": "638",
          "size": "265/70R17",
        },
        {
          "circ": "103.1",
          "dia": "32.8",
          "rpm": "614",
          "size": "285/75R16",
        },
      ]
    `);
  });
});
