import { BAssetLtvs, vectorizeOraclePrices } from '@anchor-protocol/app-fns';
import { min, max } from '@libs/big-math';
import type { Rate } from '@anchor-protocol/types';
import { bAsset, CW20Addr, moneyMarket, u } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

export const computeLtvToRedeemAmount =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
  ) =>
  (ltv: Rate<BigSource>) => {
    const collaterals = overseerCollaterals.collaterals.map((c) => c[0]);

    const prices = vectorizeOraclePrices(collaterals, oraclePrices.prices);

    const [{ amount, price, maxLtv }, total] =
      overseerCollaterals.collaterals.reduce(
        (previous, current, index) => {
          const bAssetLtv = bAssetLtvs.get(current[0]) ?? { max: 0 };

          const asset = {
            amount: Big(current[1]),
            price: Big(prices[index]),
            maxLtv: Big(bAssetLtv.max),
          };

          if (current[0] === collateralToken) {
            // return this asset deconstructed
            return [asset, previous[1]];
          }

          // not the asset we care about so just include total
          return [
            previous[0],
            previous[1].add(asset.amount.mul(asset.price).mul(asset.maxLtv)),
          ];
        },
        [{ amount: Big(0), price: Big(0), maxLtv: Big(0) }, Big(0)],
      );

    if (Big(maxLtv).lte(0)) {
      // the entire collateral position was removed
      return Big(0) as u<bAsset<Big>>;
    }

    const loanAmount = Big(marketBorrowerInfo.loan_amount);

    const minAmount = min(total.mul(ltv), loanAmount);

    const withdrawableAmount = Big(
      amount.minus(
        loanAmount.minus(minAmount).div(Big(maxLtv).mul(price).mul(ltv)),
      ),
    );

    return max(withdrawableAmount, 0) as u<bAsset<Big>>;
  };
