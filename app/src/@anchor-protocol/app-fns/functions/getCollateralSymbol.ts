import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';

export function getCollateralSymbol(collateral: COLLATERAL_DENOMS): string {
  switch (collateral) {
    case COLLATERAL_DENOMS.UBLUNA:
      return 'bLUNA';
    case COLLATERAL_DENOMS.UBETH:
      return 'bETH';
  }

  throw new Error(`Add collateral type of "${collateral}"!`);
}
