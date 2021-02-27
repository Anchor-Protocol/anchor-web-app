import {
  PollResponse,
  PollStatus,
} from '@anchor-protocol/types/contracts/anchorToken/gov/poll';

export interface Polls {
  polls: {
    filter?: PollStatus;
    start_after?: number;
    limit?: number;
    order_by?: 'asc' | 'desc';
  };
}

export interface PollsResponse {
  polls: Array<PollResponse>;
}
