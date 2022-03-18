import { NominalType, Token, u } from '@libs/types';
import big, { Big, BigSource } from 'big.js';

// ---------------------------------------------
// micro
// ---------------------------------------------
export const MICRO = 1000000;

export function microfy<T extends Token<BigSource>>(
  amount: T,
  decimals: number = 6,
): T extends NominalType<infer N> ? u<Big & NominalType<N>> : u<T> {
  return big(amount).mul(Math.pow(10, decimals)) as any;
}

export function demicrofy<T extends Token<BigSource>>(
  amount: u<T>,
  decimals: number = 6,
): T extends NominalType<infer N> ? Big & NominalType<N> : T {
  return big(amount).div(Math.pow(10, decimals)) as any;
}
