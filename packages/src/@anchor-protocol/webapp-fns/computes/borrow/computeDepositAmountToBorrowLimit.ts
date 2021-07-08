import type { ubAsset, uUST } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';

export const computeDepositAmountToBorrowLimit =
  (
    collateralToken: CW20Addr,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
    //bLunaMaxLtv: Rate<BigSource>,
  ) =>
  (depositAmount: ubAsset<BigSource>): uUST<Big> => {
    return overseerCollaterals.collaterals.reduce(
      (total, [token, lockedAmount]) => {
        const oracle = oraclePrices.prices.find(({ asset }) => asset === token);
        const ltv = bAssetLtvs.get(token);

        if (!oracle || !ltv) {
          return total;
        }

        const amount = big(big(lockedAmount).plus(depositAmount))
          .mul(oracle.price)
          .mul(ltv.max);

        return total.plus(amount);
      },
      big(0),
    ) as uUST<Big>;

    //return big(
    //  big(
    //    big(borrower.balance).minus(borrower.spendable).plus(depositAmount),
    //  ).mul(oracle.rate),
    //).mul(bLunaMaxLtv) as uUST<Big>;
  };
