import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { moneyMarket } from '@anchor-protocol/types';

export function pickCollateralDenom(
  collateral: moneyMarket.overseer.WhitelistResponse['elems'][number],
): COLLATERAL_DENOMS | undefined {
  switch (collateral.symbol) {
    case 'BLUNA':
      return COLLATERAL_DENOMS.UBLUNA;
    case 'BETH':
      return COLLATERAL_DENOMS.UBETH;
    default:
      return undefined;
  }
}
