import type { Rate, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function estimateLiquidationPrice(
  nextLtv: Rate<Big> | undefined,
  bLunaMaxLtv: Rate<BigSource>,
  oracle: moneyMarket.oracle.PriceResponse,
): UST<BigSource> {
  // formula:
  // oracle price * (nextLtv / maxLtv)
  if (nextLtv) {
    return big(oracle.rate).mul(big(nextLtv).div(big(bLunaMaxLtv))) as UST<Big>;
  }
  return oracle.rate;
}
