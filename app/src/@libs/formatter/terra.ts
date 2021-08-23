import { Luna, u, UST } from '@libs/types';

export function stripUUSD(uusd: string): u<UST> {
  return uusd.substring(0, uusd.length - 4) as u<UST>;
}

export function stripULuna(uluna: string): u<Luna> {
  return uluna.substring(0, uluna.length - 5) as u<Luna>;
}
