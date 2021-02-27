import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uToken } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#collaterals
 */
export interface Collaterals {
  collaterals: {
    borrower: HumanAddr;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#collateralsresponse
 */
export interface CollateralsResponse {
  borrower: HumanAddr;
  collaterals: Array<[HumanAddr, uToken]>;
}
