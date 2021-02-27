import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uToken } from '@anchor-protocol/types/currencies';

export interface Collaterals {
  collaterals: {
    borrower: HumanAddr;
  };
}

export interface CollateralsResponse {
  borrower: HumanAddr;
  collaterals: Array<[HumanAddr, uToken]>;
}
