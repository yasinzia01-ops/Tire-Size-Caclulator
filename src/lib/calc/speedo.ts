/**
 * Speedometer Error Calculator math — ported from
 * _legacy/calculators/speedometer-error-calculator.html.
 */

export interface TireSize {
  /** Section width, mm */
  w: number;
  /** Aspect ratio, % */
  a: number;
  /** Rim diameter, inches */
  r: number;
}

/** Tire circumference in mm (same formula as the legacy `speCirc`). */
export function circumference({ w, a, r }: TireSize): number {
  const sidewall = (a / 100) * w;
  const odInches = r + (2 * sidewall) / 25.4;
  return Math.PI * odInches * 25.4;
}

export const sizeLabel = ({ w, a, r }: { w: number | string; a: number | string; r: number | string }) => `${w}/${a}R${r}`;

/** Error in %: positive = new tire larger, true speed above indicated. */
export function speedoError(original: TireSize, next: TireSize): number {
  const oc = circumference(original);
  return ((circumference(next) - oc) / oc) * 100;
}

export type Verdict = 'ok' | 'warn' | 'bad';

export function verdict(errPct: number): { level: Verdict; text: string } {
  const e = Math.abs(errPct);
  if (e <= 3) return { level: 'ok', text: '✓ Within safe ±3% limit' };
  if (e <= 5) return { level: 'warn', text: '⚠ Exceeds ±3% limit — consider recalibration' };
  return { level: 'bad', text: '✗ Significant error — recalibration recommended' };
}

export const INDICATED_SPEEDS = [30, 50, 60, 70] as const;
export const ODO_DISTANCES = [
  { miles: 1000, label: 'Per 1,000 miles driven' },
  { miles: 10000, label: 'Per 10,000 miles driven' },
  { miles: 30000, label: 'Per 30,000 miles driven (2–3 yr average)' },
  { miles: 100000, label: 'Per 100,000 miles driven' },
] as const;

export interface SpeedoResult {
  err: number;
  errText: string;
  verdict: ReturnType<typeof verdict>;
  speeds: { indicated: number; actual: string }[];
  odometer: { label: string; text: string; positive: boolean }[];
}

export function speedoResult(original: TireSize, next: TireSize): SpeedoResult {
  const err = speedoError(original, next);
  const factor = 1 + err / 100;
  return {
    err,
    errText: (err >= 0 ? '+' : '') + err.toFixed(1) + '%',
    verdict: verdict(err),
    speeds: INDICATED_SPEEDS.map((indicated) => ({ indicated, actual: (indicated * factor).toFixed(1) })),
    odometer: ODO_DISTANCES.map(({ miles, label }) => {
      const diff = (miles * err) / 100;
      return { label, text: (diff >= 0 ? '+' : '') + diff.toFixed(0) + ' miles', positive: diff > 0 };
    }),
  };
}
