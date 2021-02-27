import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#voters
 */
export interface Voters {
  voters: {
    poll_id?: number;
    start_after?: HumanAddr;
    limit?: number;
    order_by?: 'asc' | 'desc';
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#votersresponse
 */
export interface VotersResponse {
  voters: Array<{
    voter: HumanAddr;
    vote: 'yes' | 'no';
    balance: uANC;
  }>;
}
