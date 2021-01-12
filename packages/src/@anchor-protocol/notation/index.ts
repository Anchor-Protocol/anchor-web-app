import big from 'big.js';
import numeral from 'numeral';

export const DECIMAL_POINTS = 6;
export const MICRO = 1000000;

/** @deprecated */
export function toFixedNoRounding(
  n: number | string | { toString(): string } | [string, string],
  fixed: number = DECIMAL_POINTS,
): string {
  if (Array.isArray(n)) {
    return fixed === 0
      ? numeral(n[0]).format('0,0')
      : numeral(n[0]).format('0,0') +
          '.' +
          n[1].substr(0, fixed).padEnd(fixed, '0');
  } else {
    const [i, d] = separateBasedOnDecimalPoints(n, fixed);
    return fixed === 0 ? i : i + '.' + d;
  }
}

export function mapDecimalPointBaseSeparatedNumbers<T>(n: string, mapper: (i: string, d: string | undefined) => T): T {
  const [i, d] = n.toString().split('.');
  return mapper(i, d);
}

/** @deprecated */
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

export function discardInputDecimalPoints(
  n: number | string | { toString(): string },
  keepDecimalPoints: number = DECIMAL_POINTS,
): string {
  const [i, d = ''] = n.toString().split('.');

  if (d.length === 0) {
    return i.toString();
  }

  return i + '.' + d.substr(0, keepDecimalPoints);
}

/** @deprecated */
export function discardDecimalPoints(
  n: number | string | { toString(): string },
  keepDecimalPoints: number = DECIMAL_POINTS,
): string {
  const [i, d = ''] = n.toString().split('.');

  if (d.length === 0) {
    return i.toString();
  }

  const ds: string = big(
    big('0.' + d)
      .toFixed()
      .substr(0, keepDecimalPoints + 2),
  )
    .toString()
    .substr(2);

  if (big(ds).lte(0)) {
    return i.toString();
  }

  return i + '.' + ds;
}

/** @deprecated */
export function postfixUnits(
  n: number | string | { toString(): string },
  fixed: number = 0,
  forceUnit: 'K' | 'M' | undefined = undefined,
): string {
  const x = big(n.toString());
  const unit = forceUnit ?? x.gt(1000000) ? 'M' : x.gt(1000) ? 'K' : '';

  switch (unit) {
    case 'M':
      return toFixedNoRounding(x.div(1000000).toFixed(), fixed) + 'M';
    case 'K':
      return toFixedNoRounding(x.div(1000).toFixed(), fixed) + 'K';
    default:
      return toFixedNoRounding(x.toFixed(), fixed);
  }
}

export interface FormatOptions {
  delimiter?: boolean;
}

export function formatFluidDecimalPoints(
  n: number | string | { toString(): string },
  numDecimalPoints: number,
  { delimiter }: FormatOptions = { delimiter: true },
): string {
  return numeral(
    big(
      big(n.toString())
        .mul(10 ** numDecimalPoints)
        .toFixed()
        .split('.')[0],
    )
      .div(10 ** numDecimalPoints)
      .toFixed(),
  ).format(
    delimiter
      ? `0,0.[${'0'.repeat(numDecimalPoints)}]`
      : `0.[${'0'.repeat(numDecimalPoints)}]`,
  );
}

export function formatUSTUserInput(
  n: string,
): string {
  return discardInputDecimalPoints(n, 3);
}

export function formatLunaUserInput(
  n: string,
): string {
  return discardInputDecimalPoints(n, 6);
}

export function formatUSTInput(
  n: string,
): string {
  return formatFluidDecimalPoints(n, 3, {delimiter: false});
}

export function formatLunaInput(
  n: string,
): string {
  return formatFluidDecimalPoints(n, 6, {delimiter: false});
}

export function formatUST(
  n: number | string | { toString(): string },
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 3, options);
}

export function formatUSTWithPostfixUnits(
  n: number | string | { toString(): string },
  options: FormatOptions = { delimiter: true },
): string {
  const bn = big(n.toString());

  if (bn.gte(1000000)) {
    return formatFluidDecimalPoints(bn.div(1000000), 2, options) + 'M';
  } else if (bn.gte(1000)) {
    return formatFluidDecimalPoints(bn.div(1000), 2, options) + 'K';
  } else {
    return formatUST(n, options);
  }
}

export function formatLuna(
  n: number | string | { toString(): string },
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 6, options);
}

export function formatPercentage(
  n: number | string | { toString(): string },
  options: FormatOptions = { delimiter: true },
): string {
  return formatFluidDecimalPoints(n, 2, options);
}
