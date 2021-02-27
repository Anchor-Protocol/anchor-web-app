import { PollResponse, PollStatus } from './poll';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#polls
 */
export interface Polls {
  polls: {
    filter?: PollStatus;
    start_after?: number;
    limit?: number;
    order_by?: 'asc' | 'desc';
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#pollsresponse
 */
export interface PollsResponse {
  polls: Array<PollResponse>;
}
