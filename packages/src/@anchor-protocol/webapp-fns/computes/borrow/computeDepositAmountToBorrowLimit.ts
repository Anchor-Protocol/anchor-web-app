import type { ubAsset, uUST } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { sum, vectorAdd, vectorMultiply } from '@terra-dev/big-math';
import { Big, BigSource } from 'big.js';
import { BAssetLtvs } from '../../queries/borrow/market';
import { vectorizeBAssetMaxLtvs } from './vectorizeBAssetLtvs';
import { vectorizeOraclePrices } from './vectorizeOraclePrices';
import { vectorizeOverseerCollaterals } from './vectorizeOverseerCollaterals';
import { vectorizeVariations } from './vectorizeVariations';

export const computeDepositAmountToBorrowLimit =
  (
    collateralToken: CW20Addr,
    overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
    oraclePrices: moneyMarket.oracle.PricesResponse,
    bAssetLtvs: BAssetLtvs,
    //bLunaMaxLtv: Rate<BigSource>,
  ) =>
  (depositAmount: ubAsset<BigSource>): uUST<Big> => {
    const vector = oraclePrices.prices.map(({ asset }) => asset);
    const lockedAmounts = vectorizeOverseerCollaterals(
      vector,
      overseerCollaterals.collaterals,
    );
    const prices = vectorizeOraclePrices(vector, oraclePrices.prices);
    const variations = vectorizeVariations(vector, [
      [collateralToken, depositAmount],
    ]);
    const maxLtvs = vectorizeBAssetMaxLtvs(vector, Array.from(bAssetLtvs));

    // sum(([lockedAmount] + [depositAmount]) * [oraclePrice] * [maxLtv])

    const bAssetAmounts = vectorAdd(lockedAmounts, variations);
    const ustAmounts = vectorMultiply(bAssetAmounts, prices);
    const maxLtvUstAmounts = vectorMultiply(ustAmounts, maxLtvs);

    return sum(...maxLtvUstAmounts) as uUST<Big>;

    //return overseerCollaterals.collaterals.reduce(
    //  (total, [token, lockedAmount]) => {
    //    const oracle = oraclePrices.prices.find(({ asset }) => asset === token);
    //    const ltv = bAssetLtvs.get(token);
    //
    //    if (!oracle || !ltv) {
    //      return total;
    //    }
    //
    //    const amount = big(big(lockedAmount).plus(depositAmount))
    //      .mul(oracle.price)
    //      .mul(ltv.max);
    //
    //    return total.plus(amount);
    //  },
    //  big(0),
    //) as uUST<Big>;

    //return big(
    //  big(
    //    big(borrower.balance).minus(borrower.spendable).plus(depositAmount),
    //  ).mul(oracle.rate),
    //).mul(bLunaMaxLtv) as uUST<Big>;
  };
