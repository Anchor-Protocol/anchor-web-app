import { NoMicro, Token, u } from '@libs/types';
import big, { BigSource } from 'big.js';
import { demicrofy, MICRO } from './currency';
import { formatDemimal, formatInteger } from './unit.format';

// ---------------------------------------------
// render
// ---------------------------------------------
export function mapDecimalPointBaseSeparatedNumbers<T>(
  n: string,
  mapper: (i: string, d: string | undefined) => T,
): T {
  const [i, d] = n.toString().split('.');
  return mapper(i, d);
}

// ---------------------------------------------
// formatters
// ---------------------------------------------
export const d2Formatter = formatDemimal({ decimalPoints: 2, delimiter: true });
export const d3InputFormatter = formatDemimal({
  decimalPoints: 3,
  delimiter: false,
});
export const d3Formatter = formatDemimal({ decimalPoints: 3, delimiter: true });
export const d6InputFormatter = formatDemimal({
  decimalPoints: 6,
  delimiter: false,
});
export const d6Formatter = formatDemimal({ decimalPoints: 6, delimiter: true });
export const iFormatter = formatInteger({ delimiter: true });

// ---------------------------------------------
// constants
// ---------------------------------------------
const M = 1000000;

// ---------------------------------------------
// specific format functions
// ---------------------------------------------
export function formatInput(n: Token<BigSource>): Token {
  return d6InputFormatter(n) as any;
}

export function formatUInput(n: u<Token<BigSource>>): Token {
  return d6InputFormatter(demicrofy(n)) as any;
}

export function formatToken(n: Token<BigSource> & NoMicro): string {
  return d6Formatter(n);
}

export function formatUToken(n: u<Token<BigSource>>): string {
  return d6Formatter(demicrofy(n));
}

export function formatTokenWithPostfixUnits(n: Token<BigSource>): string {
  const bn = big(n);
  return bn.gte(M) ? d3Formatter(bn.div(M)) + 'M' : formatToken(n);
}

export function formatUTokenWithPostfixUnits(n: u<Token<BigSource>>): string {
  const bn = demicrofy(n);
  return bn.gte(M) ? d3Formatter(bn.div(M)) + 'M' : formatToken(bn);
}

// ---------------------------------------------
// unspecific format functions
// ---------------------------------------------
// print decimal points
export function formatUTokenDecimal2(n: u<Token<BigSource>>): string {
  const bn = big(n).div(MICRO);
  return bn.gte(M) ? d2Formatter(bn.div(M)) + 'M' : d2Formatter(bn);
}

// print only integers
export function formatTokenIntegerWithPostfixUnits(
  n: Token<BigSource>,
): string {
  return big(n).gte(M) ? iFormatter(n) + 'M' : iFormatter(n);
}

export function formatUTokenIntegerWithPostfixUnits(
  n: u<Token<BigSource>>,
): string {
  const bn = big(n).div(MICRO);
  return bn.gte(M) ? iFormatter(bn.div(M)) + 'M' : iFormatter(bn);
}

export function formatUTokenInteger(n: u<Token<BigSource>>): string {
  const bn = big(n).div(MICRO);
  return iFormatter(bn);
}

export function formatTokenInteger(n: u<Token<BigSource>>): string {
  return iFormatter(n);
}
