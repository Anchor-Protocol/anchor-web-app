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
  fixed: number = 0,
): [string, string] {
  const [i, d = ''] = n.toString().split('.');
  return [
    numeral(i).format('0,0'),
    fixed > 0 ? d.substr(0, fixed).padEnd(fixed, '0') : d,
  ];
}
