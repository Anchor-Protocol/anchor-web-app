import { formatOutput } from '@anchor-protocol/formatter';
import type { Rate, UST } from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { Big } from 'big.js';
import { WhitelistCollateral } from 'queries';
import { microfyPrice } from 'utils/microfyPrice';

export function computeEstimateLiquidationPrice(
  nextLtv: Rate<Big>,
  WhitelistCollateral: WhitelistCollateral[],
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

  const whitelist = WhitelistCollateral.find(
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
    const decimals = whitelist?.decimals ?? 6;
    const liqPrice = Big(oracle.price)
      .mul(Big(nextLtv))
      .toString() as UST<string>;

    return `Estimated ${
      whitelist?.symbol ?? '???'
    } liquidation price: ${formatOutput(microfyPrice(liqPrice, decimals))}`;
  }

  return null;
}
