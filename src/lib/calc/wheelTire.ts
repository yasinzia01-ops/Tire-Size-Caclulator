/**
 * Wheel & Tire Calculator math — ported from the legacy Elementor widget
 * (_legacy/calculators/home-wheel-tire-calculator.html).
 *
 * All lengths are in millimetres unless a name says otherwise.
 * The one intentional change from legacy: speedo error uses
 * (new − base) / base, matching the site's other calculators (solution.md §4).
 */

export const MM_PER_IN = 25.4;
export const MAX_WHEELS = 4;

export interface WheelInput {
  /** Rim diameter, inches */
  dia: number;
  /** Rim width, inches */
  width: number;
  /** Offset (ET), mm */
  off: number;
  /** Tire section width, mm */
  tW: number;
  /** Tire profile / aspect ratio, % */
  tP: number;
}

export interface Wheel extends WheelInput {
  id: number;
  /** Overall tire diameter, mm */
  diameter: number;
  /** Tire circumference, mm */
  circ: number;
  /** Outer clearance, mm */
  poke: number;
  /** Inner clearance, mm */
  inset: number;
}

/** Same coercion as the legacy `parseFloat(x) || 0`. */
export const toNum = (v: string | number): number => (typeof v === 'number' ? v : parseFloat(v)) || 0;

export function computeWheel(input: WheelInput, id = 1): Wheel {
  const { dia, width, off, tW, tP } = input;
  const diameter = dia * MM_PER_IN + 2 * ((tW * tP) / 100);
  const halfRim = (width * MM_PER_IN) / 2;
  return {
    ...input,
    id,
    diameter,
    circ: diameter * Math.PI,
    poke: halfRim - off,
    inset: halfRim + off,
  };
}

export const computeWheels = (inputs: WheelInput[]): Wheel[] => inputs.map((w, i) => computeWheel(w, i + 1));

/** Speedo error in %: positive = new tire is larger, true speed is higher than indicated. */
export const speedoErrorPct = (base: Wheel, w: Wheel): number => ((w.diameter - base.diameter) / base.diameter) * 100;

/** True road speed when the speedometer shows `indicated`. */
export const trueSpeed = (indicated: number, base: Wheel, w: Wheel): number => indicated * (w.diameter / base.diameter);

/** Ride height change in mm (positive = taller). Arch gap change is its negative. */
export const rideHeightChange = (base: Wheel, w: Wheel): number => (w.diameter - base.diameter) / 2;

/** Ideal rim width range in inches for a tire section width. */
export const idealRimRange = (tW: number): [number, number] => [(tW * 0.7) / MM_PER_IN, (tW * 0.9) / MM_PER_IN];

// ── Display rows (strings exactly as the legacy widget rendered them) ──

export type LengthUnit = 'mm' | 'cm';

export function resultRows(wheels: Wheel[], unit: LengthUnit = 'mm'): [string, ...string[]][] {
  const base = wheels[0];
  if (!base) return [];
  const factor = unit === 'cm' ? 10 : 1;
  const fmt = (v: number) => (v / factor).toFixed(unit === 'cm' ? 2 : 1) + ' ' + unit;

  const rows: [string, (w: Wheel, i: number) => string][] = [
    ['Diameter', (w) => fmt(w.diameter)],
    ['Circumference', (w) => fmt(w.circ)],
    ['Poke', (w) => fmt(w.poke)],
    ['Inset', (w) => fmt(w.inset)],
    ['Speedo Error', (w, i) => (i === 0 ? '0%' : speedoErrorPct(base, w).toFixed(2) + '%')],
    ['Reading at 30mph', (w, i) => (i === 0 ? '30' : trueSpeed(30, base, w).toFixed(1))],
    ['Reading at 60mph', (w, i) => (i === 0 ? '60' : trueSpeed(60, base, w).toFixed(1))],
    ['Ride Height Change', (w, i) => (i === 0 ? '0 ' + unit : fmt(rideHeightChange(base, w)))],
    ['Arch Gap Change', (w, i) => (i === 0 ? '0 ' + unit : fmt(-rideHeightChange(base, w)))],
    ['Ideal Rim Range', (w) => {
      const [lo, hi] = idealRimRange(w.tW);
      return `${lo.toFixed(1)}" - ${hi.toFixed(1)}"`;
    }],
    ['Tire Size', (w) => `${w.tW}/${w.tP}R${w.dia}`],
    ['Wheel Size', (w) => `${w.dia}x${w.width} ET${w.off}`],
  ];

  return rows.map(([label, f]) => [label, ...wheels.map(f)]);
}

export type SpecsMode = 'imperial' | 'metric';

export interface SpecsRow {
  label: string;
  values: string[];
  /** Wheel 2 vs Wheel 1; absent when fewer than two wheels. */
  diff?: { text: string; sign: -1 | 0 | 1 };
}

function diffCell(value: number, unit: string): SpecsRow['diff'] {
  const r = Math.round(value * 100) / 100;
  return { text: (r > 0 ? '+' : '') + r + unit, sign: r > 0 ? 1 : r < 0 ? -1 : 0 };
}

export function specsRows(wheels: Wheel[], mode: SpecsMode = 'imperial'): SpecsRow[] {
  const base = wheels[0];
  if (!base) return [];
  const [d1, d2] = wheels;
  const imp = mode === 'imperial';
  const len = imp ? (v: number) => (v / MM_PER_IN).toFixed(2) + '"' : (v: number) => v.toFixed(1) + ' mm';
  const u = imp ? '"' : ' mm';
  const conv = imp ? (v: number) => v / MM_PER_IN : (v: number) => v;
  const ride = (w: Wheel, i: number) =>
    i === 0 ? '—' : (w.diameter > base.diameter ? 'Gain ' : 'Drop ') + len(Math.abs(rideHeightChange(base, w)));
  const speed = imp
    ? (w: Wheel, i: number) => (i === 0 ? '60 mph' : trueSpeed(60, base, w).toFixed(1) + ' mph')
    : (w: Wheel, i: number) => (i === 0 ? '100 km/h' : trueSpeed(100, base, w).toFixed(1) + ' km/h');

  const rows: [string, (w: Wheel, i: number) => string, ((a: Wheel, b: Wheel) => SpecsRow['diff'])][] = [
    ['Diameter', (w) => len(w.diameter), (a, b) => diffCell(conv(b.diameter - a.diameter), u)],
    // Legacy shows metric tire width as the raw input (no decimal).
    ['Width (Tire)', (w) => (imp ? len(w.tW) : w.tW + ' mm'), (a, b) => diffCell(conv(b.tW - a.tW), u)],
    ['Poke (Outer)', (w) => len(w.poke), (a, b) => diffCell(conv(b.poke - a.poke), u)],
    ['Inset (Inner)', (w) => len(w.inset), (a, b) => diffCell(conv(b.inset - a.inset), u)],
    ['Ride Height', ride, (a, b) => diffCell(conv(rideHeightChange(a, b)), u)],
    ['Speedometer', speed, (a, b) => diffCell(speedoErrorPct(a, b), '%')],
  ];

  return rows.map(([label, value, diff]) => ({
    label,
    values: wheels.map(value),
    ...(d2 ? { diff: diff(d1!, d2) } : {}),
  }));
}
