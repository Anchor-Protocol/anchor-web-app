import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { BidResponse } from '@anchor-protocol/types/contracts/liquidation/liquidationContract/bid';

export interface BidsByUser {
  bids_by_user: {
    bidder: HumanAddr;
    start_after?: HumanAddr;
    limit?: number;
  };
}

export interface BidsByUserResponse {
  bids: Array<BidResponse>;
}
