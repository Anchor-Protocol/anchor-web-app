import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';

const decimals = 18;

export function fromWei(value: BigNumberish): string {
  return formatUnits(value, decimals);
}

export function toWei(value: BigNumberish): string {
  return parseUnits(String(value), decimals).toString();
}
