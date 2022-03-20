import { NoMicro, UST } from '@anchor-protocol/types';
import big from 'big.js';

export const microfyPrice = (
  price: (UST & NoMicro) | undefined,
  decimals: number,
): UST => {
  if (price) {
    return big(price)
      .mul(Math.pow(10, decimals - 6))
      .toString() as UST;
  }
  return '0' as UST;
};
