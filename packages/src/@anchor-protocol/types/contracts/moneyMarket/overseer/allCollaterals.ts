import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { CollateralsResponse } from '@anchor-protocol/types/contracts/moneyMarket/overseer/collaterals';

export interface AllCollaterals {
  all_collaterals: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

export interface AllCollateralsResponse {
  all_collaterals: Array<CollateralsResponse>;
}
