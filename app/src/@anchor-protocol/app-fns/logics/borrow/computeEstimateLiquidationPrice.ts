import { OverseerWhitelistWithDisplay } from '@anchor-protocol/app-provider';
import { normalize } from '@anchor-protocol/formatter';
import { formatUST } from '@anchor-protocol/notation';
import type { Rate, u, UST } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { Big } from 'big.js';

export function computeEstimateLiquidationPrice(
  nextLtv: Rate<Big>,
  overseerWhitelist: OverseerWhitelistWithDisplay,
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
    const liqPrice = Big(
      normalize(
        oracle.price as u<UST>,
        6,
        whitelist.tokenDisplay.decimals ?? 6,
      ),
    ).mul(Big(nextLtv)) as UST<Big>;
    return `Estimated ${
      whitelist?.tokenDisplay?.symbol ?? '???'
    } liquidation price: ${formatUST(liqPrice)}`;
  }

  return null;
}
