import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { CollateralsResponse } from '@anchor-protocol/types/contracts/moneyMarket/overseer/collaterals';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#allcollaterals
 */
export interface AllCollaterals {
  all_collaterals: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#allcollateralsresponse
 */
export interface AllCollateralsResponse {
  all_collaterals: Array<CollateralsResponse>;
}
