import { computeBorrowLimit } from '@anchor-protocol/app-fns';
import type { bAsset, CW20Addr, u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';

export function computeRedeemCollateralBorrowLimit(
  collateralToken: CW20Addr,
  redeemAmount: u<bAsset>,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  bAssetLtvs: BAssetLtvs,
): u<UST<Big>> {
  if (redeemAmount.length <= 0) {
    return big(0) as u<UST<Big>>;
  }
  return computeBorrowLimit(overseerCollaterals, oraclePrices, bAssetLtvs, [
    collateralToken,
    big(redeemAmount).mul(-1) as u<bAsset<BigSource>>,
  ]);
}
