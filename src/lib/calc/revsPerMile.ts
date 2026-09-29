/**
 * Tire Revolutions Per Mile math — ported from
 * _legacy/calculators/tire-revolutions-per-mile-calculator.html.
 *
 * Intentional fix (owner-approved "use the accurate formula", solution.md §4):
 * legacy computed actual speed as 60 / (1 + err), which says a larger tire is
 * *slower* than indicated. Correct is 60 × (1 + err), matching the page copy
 * and the other two calculators.
 */
import type { TireSize } from './speedo';

export const INCHES_PER_MILE = 63360;

export interface TireData {
  diameterIn: number;
  circumferenceIn: number;
  rpm: number;
}

export function tireData({ w, a, r }: TireSize): TireData {
  const sidewallMm = (a / 100) * w;
  const diameterIn = r + 2 * (sidewallMm / 25.4);
  const circumferenceIn = Math.PI * diameterIn;
  return { diameterIn, circumferenceIn, rpm: INCHES_PER_MILE / circumferenceIn };
}

type Tone = 'pos' | 'neg' | 'zero';

export interface RpmResult {
  t1Rpm: string;
  t2Rpm: string;
  diff: { text: string; tone: Tone };
  t1Dia: string;
  t2Dia: string;
  speedo: { text: string; tone: Tone };
  actual: { text: string; tone: Tone };
}

export function rpmResult(t1Size: TireSize, t2Size: TireSize): RpmResult {
  const t1 = tireData(t1Size);
  const t2 = tireData(t2Size);
  const diff = t2.rpm - t1.rpm;
  const speedoErr = ((t2.circumferenceIn - t1.circumferenceIn) / t1.circumferenceIn) * 100;
  const actual = 60 * (1 + speedoErr / 100);
  return {
    t1Rpm: String(Math.round(t1.rpm)),
    t2Rpm: String(Math.round(t2.rpm)),
    // Legacy colouring: fewer revs (bigger tire) is shown green.
    diff: { text: (diff >= 0 ? '+' : '') + Math.round(diff), tone: diff > 1 ? 'neg' : diff < -1 ? 'pos' : 'zero' },
    t1Dia: t1.diameterIn.toFixed(2) + '"',
    t2Dia: t2.diameterIn.toFixed(2) + '"',
    speedo: { text: (speedoErr >= 0 ? '+' : '') + speedoErr.toFixed(1) + '%', tone: speedoErr > 0.5 ? 'pos' : speedoErr < -0.5 ? 'neg' : 'zero' },
    actual: { text: actual.toFixed(1) + ' mph', tone: actual > 60.3 ? 'pos' : actual < 59.7 ? 'neg' : 'zero' },
  };
}

/** Sizes shown in the "Common Tire Sizes" reference table (values computed, not hard-coded). */
export const REFERENCE_SIZES: TireSize[] = [
  { w: 175, a: 65, r: 14 },
  { w: 195, a: 65, r: 15 },
  { w: 205, a: 55, r: 16 },
  { w: 215, a: 55, r: 17 },
  { w: 225, a: 45, r: 17 },
  { w: 235, a: 35, r: 19 },
  { w: 245, a: 40, r: 18 },
  { w: 265, a: 70, r: 17 },
  { w: 285, a: 75, r: 16 },
];

export const referenceRow = (s: TireSize) => {
  const d = tireData(s);
  return { size: `${s.w}/${s.a}R${s.r}`, dia: d.diameterIn.toFixed(1), circ: d.circumferenceIn.toFixed(1), rpm: String(Math.round(d.rpm)) };
};
