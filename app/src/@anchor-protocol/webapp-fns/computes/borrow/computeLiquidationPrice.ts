import { CW20Addr, moneyMarket, Rate, UST } from '@anchor-protocol/types';
import big from 'big.js';

export function computeLiquidationPrice(
  token: CW20Addr,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  overseerBorrowLimit: moneyMarket.overseer.BorrowLimitResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
): UST {
  const collateral = overseerCollaterals.collaterals.find(
    ([collateralToken]) => collateralToken === token,
  );

  if (!collateral) {
    return '0' as UST;
  }

  const maxLtv =
    overseerWhitelist.elems.find(
      ({ collateral_token }) => collateral_token === token,
    )?.max_ltv ?? ('0.7' as Rate);

  const oracle = oraclePrices.prices.find(({ asset }) => asset === token);

  if (!oracle) {
    return '0' as UST;
  }

  return big(marketBorrowerInfo.loan_amount)
    .div(big(collateral[1]).mul(maxLtv))
    .toFixed() as UST;
}
