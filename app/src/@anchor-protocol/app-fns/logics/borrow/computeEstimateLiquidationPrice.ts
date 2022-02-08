import { formatUST } from '@anchor-protocol/notation';
import type { Rate } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { Big } from 'big.js';
import { prettifySymbol } from '@anchor-protocol/app-fns/functions/prettifySymbol';

export function computeEstimateLiquidationPrice(
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
    // const liqPrice = Big(oracle.price).mul(
    //   Big(nextLtv).div(whitelist.max_ltv),
    // ) as UST<Big>;
    const liqPrice = Big(oracle.price).mul(Big(nextLtv)) as UST<Big>;
    return `Estimated ${prettifySymbol(
      whitelist.symbol,
    )} liquidation price: ${formatUST(liqPrice)}`;
  }

  return null;
}
