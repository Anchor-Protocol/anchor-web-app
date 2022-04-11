import { formatOutput } from '@anchor-protocol/formatter';
import type {
  bAsset,
  CollateralAmount,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { Big } from 'big.js';
import { WhitelistCollateral } from 'queries';
import { microfyPrice } from 'utils/microfyPrice';
import { group } from 'd3-array';

export function computeEstimateLiquidationPrice(
  nextLtv: Rate<Big>,
  whitelistCollateral: WhitelistCollateral[],
  borrowerCollateral: [CW20Addr, u<CollateralAmount<Big>> | u<bAsset>][],
  oraclePrices: moneyMarket.oracle.PricesResponse,
  targetToken?: CW20Addr,
): string | null {
  const collaterals = group(borrowerCollateral, (key) => key[0]);

  if (collaterals.size === 0) {
    return null;
  }

  if (collaterals.size > 1) {
    return 'Estimated liquidation price not available for composite loans';
  }

  if (targetToken && collaterals.has(targetToken) === false) {
    // if we have supplied a filter ensure that it is the only one
    return null;
  }

  const collateral = Array.from(collaterals.keys())[0];

  const whitelist = whitelistCollateral.find(
    ({ collateral_token }) => collateral_token === collateral,
  );
  const oracle = oraclePrices.prices.find(({ asset }) => asset === collateral);

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
