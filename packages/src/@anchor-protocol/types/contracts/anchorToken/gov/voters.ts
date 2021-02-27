import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

export interface Voters {
  voters: {
    poll_id?: number;
    start_after?: HumanAddr;
    limit?: number;
    order_by?: 'asc' | 'desc';
  };
}

export interface VotersResponse {
  voters: Array<{
    voter: HumanAddr;
    vote: 'yes' | 'no';
    balance: uANC;
  }>;
}
