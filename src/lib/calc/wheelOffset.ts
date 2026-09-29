/**
 * Wheel Offset Calculator math — ported from _legacy/calculators/wheel-offset-calculator.html.
 */
import { MM_PER_IN } from './wheelTire';

export interface OffsetWheel {
  /** Rim width, inches */
  width: number;
  /** Offset (ET), mm */
  et: number;
}

type Tone = 'red' | 'blue' | 'green' | '';

export interface OffsetResult {
  outerDiff: number;
  innerDiff: number;
  outer: { value: string; tone: Tone; note: string };
  inner: { value: string; tone: Tone; note: string };
  status: { value: 'Safe' | 'Caution' | 'Risk'; tone: Tone; note: string };
  /** Verdict sentence as HTML (only numbers are interpolated). */
  verdictHtml: string;
}

/** Outer face distance from the hub face (bigger = more poke). */
export const outerPosition = ({ width, et }: OffsetWheel) => (width * MM_PER_IN) / 2 - et;
/** Inner face distance from the hub face (bigger = less inner clearance). */
export const innerPosition = ({ width, et }: OffsetWheel) => (width * MM_PER_IN) / 2 + et;

export function offsetResult(stock: OffsetWheel, next: OffsetWheel): OffsetResult {
  const outerDiff = outerPosition(next) - outerPosition(stock);
  const innerDiff = innerPosition(next) - innerPosition(stock);

  const outer: OffsetResult['outer'] =
    outerDiff > 0 ? { value: '+' + outerDiff.toFixed(1) + ' mm', tone: 'red', note: 'More Poke — sticks out further' }
    : outerDiff < 0 ? { value: outerDiff.toFixed(1) + ' mm', tone: 'blue', note: 'More Tuck — sits further inward' }
    : { value: '0 mm', tone: '', note: 'No change in outer position' };

  const inner: OffsetResult['inner'] =
    innerDiff > 0 ? { value: '+' + innerDiff.toFixed(1) + ' mm', tone: 'red', note: 'Less inner clearance vs stock' }
    : innerDiff < 0 ? { value: innerDiff.toFixed(1) + ' mm', tone: 'green', note: 'More inner clearance vs stock' }
    : { value: '0 mm', tone: '', note: 'No inner clearance change' };

  const abs = Math.abs(outerDiff);
  const status: OffsetResult['status'] =
    abs <= 10 ? { value: 'Safe', tone: 'green', note: 'Within ±10mm safe zone' }
    : abs <= 20 ? { value: 'Caution', tone: '', note: 'Check fender clearance' }
    : { value: 'Risk', tone: 'red', note: 'Fender work likely needed' };

  const dir = outerDiff >= 0
    ? 'stick out <strong>' + abs.toFixed(1) + 'mm more</strong>'
    : 'sit <strong>' + abs.toFixed(1) + 'mm further inward</strong>';
  const ic = innerDiff > 0
    ? '<strong>' + Math.abs(innerDiff).toFixed(1) + 'mm less</strong> inner clearance'
    : '<strong>' + Math.abs(innerDiff).toFixed(1) + 'mm more</strong> inner clearance';
  const safe = abs <= 10 ? 'This is within the safe range for most vehicles — no fender modification expected.'
    : abs <= 20 ? 'Check fender clearance before driving. Fender rolling may be required.'
    : 'Significant offset change — fender modification or aftermarket suspension is likely required.';

  return {
    outerDiff, innerDiff, outer, inner, status,
    verdictHtml: '<strong>Result:</strong> Your new wheel will ' + dir + ' compared to stock. You will have ' + ic + '. ' + safe,
  };
}
