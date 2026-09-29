import { describe, expect, test } from 'vitest';
import { computeWheels, resultRows, specsRows, speedoErrorPct, type WheelInput } from './wheelTire';

/**
 * Verbatim copy of the legacy widget's calculate() + updateSpecsTable() string logic
 * (_legacy/calculators/home-wheel-tire-calculator.html), minus the DOM.
 */
function legacy(inputs: WheelInput[], isCM: boolean) {
  const factor = isCM ? 10 : 1;
  const unit = isCM ? 'cm' : 'mm';
  const fmt = (v: number) => (v / factor).toFixed(isCM ? 2 : 1) + ' ' + unit;
  const wheelData = inputs.map(({ dia, width, off, tW, tP }, index) => {
    const totalDia = dia * 25.4 + 2 * ((tW * tP) / 100);
    const circ = totalDia * Math.PI;
    const poke = (width * 25.4) / 2 - off;
    const inset = (width * 25.4) / 2 + off;
    return { id: index + 1, diameter: totalDia, circ, poke, inset, tW, tP, dia, width, off };
  });
  type D = (typeof wheelData)[number];
  const base = wheelData[0]!;
  const rows: [string, (d: D, i: number) => string][] = [
    ['Diameter', (d) => fmt(d.diameter)],
    ['Circumference', (d) => fmt(d.circ)],
    ['Poke', (d) => fmt(d.poke)],
    ['Inset', (d) => fmt(d.inset)],
    ['Speedo Error', (d, i) => (i === 0 ? '0%' : (((base.diameter - d.diameter) / base.diameter) * 100).toFixed(2) + '%')],
    ['Reading at 30mph', (d, i) => (i === 0 ? '30' : (30 * (d.diameter / base.diameter)).toFixed(1))],
    ['Reading at 60mph', (d, i) => (i === 0 ? '60' : (60 * (d.diameter / base.diameter)).toFixed(1))],
    ['Ride Height Change', (d, i) => (i === 0 ? '0 ' + unit : fmt((d.diameter - base.diameter) / 2))],
    ['Arch Gap Change', (d, i) => (i === 0 ? '0 ' + unit : fmt(-((d.diameter - base.diameter) / 2)))],
    ['Ideal Rim Range', (d) => `${((d.tW * 0.7) / 25.4).toFixed(1)}" - ${((d.tW * 0.9) / 25.4).toFixed(1)}"`],
    ['Tire Size', (d) => `${d.tW}/${d.tP}R${d.dia}`],
    ['Wheel Size', (d) => `${d.dia}x${d.width} ET${d.off}`],
  ];
  const results = rows.map(([l, f]) => [l, ...wheelData.map(f)]);

  const specs = (imperial: boolean) => {
    const out: Record<string, string> = {};
    const setDiff = (id: string, diff: number, u: string) => {
      const r = Math.round(diff * 100) / 100;
      out[id] = (r > 0 ? '+' : '') + r + u;
    };
    const d1 = wheelData[0]!, d2 = wheelData[1];
    if (imperial) {
      const mm2in = (v: number) => (v / 25.4).toFixed(2);
      wheelData.forEach((d, i) => {
        out[`dia${i}`] = mm2in(d.diameter) + '"';
        out[`wid${i}`] = mm2in(d.tW) + '"';
        out[`poke${i}`] = mm2in(d.poke) + '"';
        out[`inset${i}`] = mm2in(d.inset) + '"';
        out[`ride${i}`] = i === 0 ? '—' : (d.diameter > base.diameter ? 'Gain ' : 'Drop ') + mm2in(Math.abs((d.diameter - base.diameter) / 2)) + '"';
        out[`spd${i}`] = i === 0 ? '60 mph' : (60 * (d.diameter / base.diameter)).toFixed(1) + ' mph';
      });
      if (d2) {
        setDiff('dia-d', (d2.diameter - d1.diameter) / 25.4, '"');
        setDiff('wid-d', (d2.tW - d1.tW) / 25.4, '"');
        setDiff('poke-d', (d2.poke - d1.poke) / 25.4, '"');
        setDiff('inset-d', (d2.inset - d1.inset) / 25.4, '"');
        setDiff('ride-d', (d2.diameter - d1.diameter) / 2 / 25.4, '"');
        setDiff('spd-d', (d2.diameter / d1.diameter) * 100 - 100, '%');
      }
    } else {
      wheelData.forEach((d, i) => {
        out[`dia${i}`] = d.diameter.toFixed(1) + ' mm';
        out[`wid${i}`] = d.tW + ' mm';
        out[`poke${i}`] = d.poke.toFixed(1) + ' mm';
        out[`inset${i}`] = d.inset.toFixed(1) + ' mm';
        out[`ride${i}`] = i === 0 ? '—' : (d.diameter > base.diameter ? 'Gain ' : 'Drop ') + (Math.abs(d.diameter - base.diameter) / 2).toFixed(1) + ' mm';
        out[`spd${i}`] = i === 0 ? '100 km/h' : (100 * (d.diameter / base.diameter)).toFixed(1) + ' km/h';
      });
      if (d2) {
        setDiff('dia-d', d2.diameter - d1.diameter, ' mm');
        setDiff('wid-d', d2.tW - d1.tW, ' mm');
        setDiff('poke-d', d2.poke - d1.poke, ' mm');
        setDiff('inset-d', d2.inset - d1.inset, ' mm');
        setDiff('ride-d', (d2.diameter - d1.diameter) / 2, ' mm');
        setDiff('spd-d', (d2.diameter / d1.diameter) * 100 - 100, '%');
      }
    }
    return out;
  };
  return { results, specs };
}

const w = (dia: number, width: number, off: number, tW: number, tP: number): WheelInput => ({ dia, width, off, tW, tP });

const CASES: [string, WheelInput[]][] = [
  ['live defaults 205/45R17 vs 225/40R18', [w(17, 7, 48, 205, 45), w(18, 8, 35, 225, 40)]],
  ['plus-one 205/55R16 → 225/45R17', [w(16, 6.5, 45, 205, 55), w(17, 7.5, 40, 225, 45)]],
  ['truck 265/70R17 → 285/75R17', [w(17, 8, 25, 265, 70), w(17, 8.5, 0, 285, 75)]],
  ['negative offset', [w(15, 7, 20, 195, 65), w(15, 8, -12, 215, 60)]],
  ['smaller new tire', [w(18, 8, 45, 235, 45), w(17, 7.5, 45, 225, 45)]],
  ['identical wheels', [w(17, 7, 48, 205, 45), w(17, 7, 48, 205, 45)]],
  ['three wheels', [w(17, 7, 48, 205, 45), w(18, 8, 35, 225, 40), w(19, 8.5, 35, 235, 35)]],
  ['four wheels', [w(16, 7, 40, 205, 55), w(17, 7.5, 38, 215, 45), w(18, 8, 35, 225, 40), w(19, 8.5, 30, 245, 35)]],
  ['fractional sizes', [w(17.5, 6.75, 42.5, 215, 75), w(19.5, 7.5, 50, 245, 70)]],
  ['single wheel', [w(17, 7, 48, 205, 45)]],
  ['empty inputs (zeros)', [w(0, 0, 0, 0, 0), w(18, 8, 35, 225, 40)]],
];

const flipSign = (s: string) => (s.startsWith('-') ? s.slice(1) : s === '0.00%' || s === '0%' ? s : '-' + s);

describe('wheelTire matches legacy widget', () => {
  for (const [name, inputs] of CASES) {
    for (const unit of ['mm', 'cm'] as const) {
      test(`${name} — results table (${unit})`, () => {
        const ours = resultRows(computeWheels(inputs), unit);
        const ref = legacy(inputs, unit === 'cm').results;
        ours.forEach((row, r) => {
          if (row[0] === 'Speedo Error') {
            // Intentional change: sign flipped to (new − base) / base.
            row.slice(1).forEach((cell, c) => expect(cell).toBe(flipSign(ref[r]![c + 1]!)));
          } else {
            expect(row).toEqual(ref[r]);
          }
        });
      });
    }
    for (const mode of ['imperial', 'metric'] as const) {
      test(`${name} — specs table (${mode})`, () => {
        const ours = specsRows(computeWheels(inputs), mode);
        const ref = legacy(inputs, false).specs(mode === 'imperial');
        const keys = ['dia', 'wid', 'poke', 'inset', 'ride', 'spd'];
        ours.forEach((row, r) => {
          row.values.forEach((v, i) => expect(v).toBe(ref[`${keys[r]}${i}`]));
          expect(row.diff?.text).toBe(ref[`${keys[r]}-d`]);
        });
      });
    }
  }
});

describe('speedo error convention', () => {
  test('bigger tire → positive error, matches live specs table (+3.39%)', () => {
    const [a, b] = computeWheels([w(17, 7, 48, 205, 45), w(18, 8, 35, 225, 40)]);
    expect(speedoErrorPct(a!, b!).toFixed(2)).toBe('3.39');
  });
  test('live screenshot values for the default setup', () => {
    const rows = Object.fromEntries(resultRows(computeWheels([w(17, 7, 48, 205, 45), w(18, 8, 35, 225, 40)])).map((r) => [r[0], r.slice(1)]));
    expect(rows['Diameter']).toEqual(['616.3 mm', '637.2 mm']);
    expect(rows['Circumference']).toEqual(['1936.2 mm', '2001.8 mm']);
    expect(rows['Poke']).toEqual(['40.9 mm', '66.6 mm']);
    expect(rows['Inset']).toEqual(['136.9 mm', '136.6 mm']);
    expect(rows['Speedo Error']).toEqual(['0%', '3.39%']);
    expect(rows['Reading at 60mph']).toEqual(['60', '62.0']);
    expect(rows['Ride Height Change']).toEqual(['0 mm', '10.5 mm']);
    expect(rows['Arch Gap Change']).toEqual(['0 mm', '-10.5 mm']);
    expect(rows['Ideal Rim Range']).toEqual(['5.6" - 7.3"', '6.2" - 8.0"']);
  });
});
