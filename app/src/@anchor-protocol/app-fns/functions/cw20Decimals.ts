import { cw20, Token, u } from '@libs/types';
import big from 'big.js';

export function importCW20Decimals<T extends Token>(
  number: u<T>,
  tokenInfo: cw20.TokenInfoResponse<Token>,
): u<T> {
  if (tokenInfo.decimals === 6) {
    return number;
  }
  const gap = tokenInfo.decimals - 6;
  return big(number).div(Math.pow(10, gap)).toFixed() as u<T>;
}

export function exportCW20Decimals<T extends Token>(
  number: u<T>,
  tokenInfo: cw20.TokenInfoResponse<Token>,
): u<T> {
  if (tokenInfo.decimals === 6) {
    return number;
  }
  const gap = tokenInfo.decimals - 6;
  return big(number).mul(Math.pow(10, gap)).toFixed() as u<T>;
}
