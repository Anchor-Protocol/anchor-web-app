import { CW20Addr, moneyMarket } from '@anchor-protocol/types';

export function pickCollateral(
  collateralToken: CW20Addr,
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse,
) {
  const elem = overseerWhitelist.elems.find(
    ({ collateral_token }) => collateral_token === collateralToken,
  );

  if (!elem) {
    throw new Error(`Can't find collateral element of "${collateralToken}"`);
  }

  return elem;
}
