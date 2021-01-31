import { uLuna, uUST } from './currency';

export function stripUUSD(uusd: string): uUST {
  return uusd.substring(0, uusd.length - 4) as uUST;
}

export function stripULuna(uluna: string): uLuna {
  return uluna.substring(0, uluna.length - 5) as uLuna;
}
