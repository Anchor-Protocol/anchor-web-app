import big from 'big.js';
import numeral from 'numeral';

export const DECIMAL_POINTS = 6;
export const MICRO = 1000000;

export function toFixedNoRounding(
  n: number | string | { toString(): string } | [string, string],
  fixed: number = DECIMAL_POINTS,
): string {
  if (Array.isArray(n)) {
    return (
      numeral(n[0]).format('0,0') +
      '.' +
      n[1].substr(0, fixed).padEnd(fixed, '0')
    );
  } else {
    const [i, d] = separateBasedOnDecimalPoints(n, fixed);
    return i + '.' + d;
  }
}

export function separateBasedOnDecimalPoints(
  n: number | string | { toString(): string },
  fixed: number = DECIMAL_POINTS,
): [string, string] {
  const [i, d = ''] = n.toString().split('.');
  return [
    numeral(i).format('0,0'),
    fixed > 0 ? d.substr(0, fixed).padEnd(fixed, '0') : d,
  ];
}

export function truncate(
  text: string = '',
  [h, t]: [number, number] = [6, 6],
): string {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
}

export function discardDecimalPoints(
  n: number | string | { toString(): string },
  keepDecimalPoints: number = DECIMAL_POINTS,
): string {
  const [i, d = ''] = n.toString().split('.');
  const dn = big(d.length > 0 ? d : 0);

  if (dn.lte(0)) {
    return i.toString();
  }

  const ds: string = dn.toFixed().substr(0, keepDecimalPoints);

  if (big(ds).lte(0)) {
    return i.toString();
  }

  return i + '.' + ds;
}
