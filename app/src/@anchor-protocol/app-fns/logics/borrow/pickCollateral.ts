import { CW20Addr } from '@anchor-protocol/types';
import { WhitelistCollateral } from 'queries';

export function pickCollateral(
  collateralToken: CW20Addr,
  whitelist: WhitelistCollateral[],
): WhitelistCollateral {
  const elem = whitelist.find(
    ({ collateral_token }) => collateral_token === collateralToken,
  );

  if (!elem) {
    throw new Error(`Can't find collateral element of "${collateralToken}"`);
  }

  return elem;
}
