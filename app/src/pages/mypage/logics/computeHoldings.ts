import {
  AnchorBalances,
  BAssetInfoAndBalancesTotal,
} from '@anchor-protocol/app-fns';
import { moneyMarket, u, UST } from '@anchor-protocol/types';
import { sum, vectorMultiply } from '@libs/big-math';
import { Big } from 'big.js';

export function computeHoldings(
  tokenBalances: AnchorBalances,
  ancPrice: UST | undefined,
  oraclePrices: moneyMarket.oracle.PricesResponse | undefined,
  bAssetBalanceTotal: BAssetInfoAndBalancesTotal | undefined,
) {
  if (!ancPrice || !oraclePrices) {
    return '0' as u<UST>;
  }

  const holdingsVector = [tokenBalances.uANC];

  const holdingsPriceVector = [ancPrice];

  const holdingsUst = vectorMultiply(holdingsVector, holdingsPriceVector);

  const holdingsUstTotal = sum(...holdingsUst);

  return (
    bAssetBalanceTotal
      ? holdingsUstTotal.plus(bAssetBalanceTotal.totalUstValue)
      : holdingsUstTotal
  ) as u<UST<Big>>;
}
