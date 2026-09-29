/**
 * Homepage "Tire Size Calculator Charts". The sizes are the ones listed on the live page,
 * but diameters/widths are computed with the calculator formula and each size is placed in
 * the group it actually belongs to. The live charts had ~30 wrong diameters (solution.md §10).
 */
import { MM_PER_IN } from '../lib/calc/wheelTire';

export interface ChartSize {
  label: string;
  w: number;
  a: number;
  r: number;
  /** Overall diameter, inches */
  dia: number;
  /** Section width, inches */
  width: number;
}

export function parseSize(label: string): ChartSize {
  const m = label.match(/^(\d+)\/(\d+)R(\d+)$/);
  if (!m) throw new Error(`Bad size ${label}`);
  const [w, a, r] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return { label, w, a, r, dia: r + (2 * w * a) / 100 / MM_PER_IN, width: w / MM_PER_IN };
}

const trim = (n: number) => n.toFixed(1).replace(/\.0$/, '');
/** "205/45R17 = 24.3×8.1R17" — the live chart's notation. */
export const sizeNotation = (s: ChartSize) => `${s.label} = ${s.dia.toFixed(1)}×${trim(s.width)}R${s.r}`;

/** Sizes the live "by wheel size" chart lists for each rim. */
const BY_WHEEL: Record<number, string[]> = {
  15: ['175/65R15', '185/60R15', '205/55R15', '215/50R15', '225/50R15', '195/65R15', '205/60R15', '215/60R15', '225/60R15', '235/55R15'],
  16: ['185/55R16', '205/45R16', '215/45R16', '225/40R16', '195/55R16', '205/50R16', '215/55R16', '225/50R16', '235/50R16', '245/45R16'],
  17: ['205/45R17', '215/45R17', '225/40R17', '235/40R17', '245/40R17', '225/45R17', '235/45R17', '245/45R17', '255/40R17', '265/40R17', '275/40R17'],
  18: ['215/40R18', '225/40R18', '235/40R18', '245/35R18', '245/40R18', '255/40R18', '265/35R18', '275/35R18', '285/35R18'],
  19: ['225/35R19', '235/35R19', '245/35R19', '255/35R19', '265/30R19', '275/30R19', '285/30R19'],
  20: ['245/30R20', '255/30R20', '265/30R20', '275/30R20', '285/30R20', '295/25R20', '305/25R20'],
};

/** Extra sizes the live "by diameter" chart listed. */
const DIAMETER_POOL = [
  '175/65R14', '185/60R14', '195/55R14', '205/50R14', '175/60R15', '185/55R15', '195/50R15', '205/50R15', '215/45R15',
  '175/50R16', '185/45R16', '195/40R16', '215/55R15', '225/45R16', '185/50R17', '195/45R17', '205/40R17', '225/65R15',
  '235/60R15', '245/55R15', '205/50R17', '245/35R17', '235/60R16', '245/55R16', '255/50R16', '225/50R17', '235/50R17',
  '215/45R18', '265/55R17', '275/50R17', '285/45R17', '245/50R18', '255/45R18', '265/40R18', '225/45R19', '235/40R19',
  '305/60R17', '315/55R17', '295/60R17', '285/55R18', '275/55R18', '265/55R18', '255/50R19', '265/45R19', '275/40R19',
];

export const WHEEL_TABS = [15, 16, 17, 18, 19, 20] as const;
export const DIAMETER_TABS = [24, 25, 26, 27, 28, 29] as const;

export interface ChartColumn { heading: string; items: string[] }

const rangeLabel = (sizes: ChartSize[]) => {
  const lo = Math.floor(Math.min(...sizes.map((s) => s.dia)));
  const hi = Math.ceil(Math.max(...sizes.map((s) => s.dia)));
  return lo === hi || hi - lo < 1 ? `${lo}" Dia` : `${lo}"–${hi}" Dia`;
};

/** Two columns per rim, split by overall diameter (smaller half first). */
export function wheelSizeColumns(rim: number): ChartColumn[] {
  const sizes = BY_WHEEL[rim]!.map(parseSize).sort((a, b) => a.dia - b.dia || a.w - b.w);
  const half = Math.ceil(sizes.length / 2);
  return [sizes.slice(0, half), sizes.slice(half)].filter((c) => c.length).map((col) => ({ heading: rangeLabel(col), items: col.map(sizeNotation) }));
}

/** Every listed size whose overall diameter rounds to `inches`, one column per rim size. */
export function diameterColumns(inches: number): ChartColumn[] {
  const all = new Map<string, ChartSize>();
  for (const l of [...Object.values(BY_WHEEL).flat(), ...DIAMETER_POOL]) all.set(l, parseSize(l));
  const matches = [...all.values()].filter((s) => Math.round(s.dia) === inches);
  const rims = [...new Set(matches.map((s) => s.r))].sort((a, b) => a - b);
  return rims.map((r) => ({
    heading: `${r}" Wheel`,
    items: matches.filter((s) => s.r === r).sort((a, b) => a.w - b.w).map((s) => s.label),
  }));
}
