import { CW20Addr, moneyMarket, ubAsset, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function computeCollateralTotalLockedUST(
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  ...variation: Array<[CW20Addr, ubAsset<BigSource>]>
): uUST<Big> {
  return overseerCollaterals.collaterals.reduce(
    (total, [token, lockedAmount]) => {
      const oracle = oraclePrices.prices.find(({ asset }) => asset === token);

      const vari = variation?.find(
        ([variationToken]) => variationToken === token,
      );
      const amount = vari ? big(lockedAmount).plus(vari[1]) : lockedAmount;

      return oracle ? total.plus(big(amount).mul(oracle.price)) : total;
    },
    big(0),
  ) as uUST<Big>;
}
