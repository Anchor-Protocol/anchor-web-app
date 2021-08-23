import { NominalType, Token, u } from '@libs/types';
import big, { Big, BigSource } from 'big.js';

// ---------------------------------------------
// micro
// ---------------------------------------------
export const MICRO = 1000000;

export function microfy<T extends Token<BigSource>>(
  amount: T,
): T extends NominalType<infer N> ? u<Big & NominalType<N>> : u<T> {
  return big(amount).mul(MICRO) as any;
}

export function demicrofy<T extends Token<BigSource>>(
  amount: u<T>,
): T extends NominalType<infer N> ? Big & NominalType<N> : T {
  return big(amount).div(MICRO) as any;
}
