import { formatUST } from '@anchor-protocol/notation';
import type { Rate, UST } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { prettifyBAssetSymbol } from '@anchor-protocol/webapp-fns';
import big, { Big } from 'big.js';

export function estimateLiquidationPrice(
  nextLtv: Rate<Big>,
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse,
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse,
  oraclePrices: moneyMarket.oracle.PricesResponse,
  targetToken?: CW20Addr,
): string | null {
  if (overseerCollaterals.collaterals.length === 0) {
    return null;
  } else if (overseerCollaterals.collaterals.length > 1) {
    return 'Estimated liquidation price not available for composite loans';
  }

  const collateral = overseerCollaterals.collaterals[0];

  if (targetToken && collateral[0] !== targetToken) {
    return null;
  }

  const whitelist = overseerWhitelist.elems.find(
    ({ collateral_token }) => collateral_token === collateral[0],
  );
  const oracle = oraclePrices.prices.find(
    ({ asset }) => asset === collateral[0],
  );

  if (!whitelist || !oracle) {
    return null;
  }

  // formula: oracle price * (nextLtv / maxLtv)
  if (nextLtv) {
    const liqPrice = big(oracle.price).mul(
      big(nextLtv).div(whitelist.max_ltv),
    ) as UST<Big>;
    return `Estimated ${prettifyBAssetSymbol(
      whitelist.symbol,
    )} liquidation price: ${formatUST(liqPrice)}`;
  }

  return null;
}
