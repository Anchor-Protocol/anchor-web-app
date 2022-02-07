import { OverseerWhitelistWithDisplay } from '@anchor-protocol/app-provider';
import { CW20Addr } from '@anchor-protocol/types';

export function pickCollateral(
  collateralToken: CW20Addr,
  overseerWhitelist: OverseerWhitelistWithDisplay,
) {
  const elem = overseerWhitelist.elems.find(
    ({ collateral_token }) => collateral_token === collateralToken,
  );

  if (!elem) {
    throw new Error(`Can't find collateral element of "${collateralToken}"`);
  }

  return elem;
}
