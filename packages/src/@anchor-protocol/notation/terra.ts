import { uUST } from '@anchor-protocol/notation/currency';

export function stripUUSD(uusd: string): uUST {
  return uusd.substring(0, uusd.length - 4) as uUST;
}
