import {
  BAssetLtvs,
  computeBorrowedAmount,
  computeBorrowLimit,
  vectorizeOraclePrices,
} from '@anchor-protocol/app-fns';
import type { bAsset, Rate, u } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';

export const computeLtvToDepositAmount =
  (
    collateralToken: CW20Addr,
    marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
  ) =>
  (ltv: Rate<BigSource>): u<bAsset<Big>> => {
    console.log('computeLtvToDepositAmount:ltv', ltv.toString());

    const borrowLimit = computeBorrowLimit(
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
    );

    console.log(
      'computeLtvToDepositAmount:borrowLimit',
      borrowLimit.toString(),
    );

    const prices = vectorizeOraclePrices(
      [collateralToken],
      oraclePrices.prices,
    );

    console.log('computeLtvToDepositAmount:prices', prices);

    const borrowedAmount = computeBorrowedAmount(marketBorrowerInfo);

    console.log(
      'computeLtvToDepositAmount:borrowedAmount',
      borrowedAmount.toString(),
    );

    const increasedAmount = borrowedAmount.div(ltv).minus(borrowLimit);

    return increasedAmount.div(prices[0]) as u<bAsset<Big>>;
  };
