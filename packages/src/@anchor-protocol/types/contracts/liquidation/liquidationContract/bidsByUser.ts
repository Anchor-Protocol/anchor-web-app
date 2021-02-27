import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { BidResponse } from '@anchor-protocol/types/contracts/liquidation/liquidationContract/bid';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbyuser
 */
export interface BidsByUser {
  bids_by_user: {
    bidder: HumanAddr;
    start_after?: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbyuserresponse
 */
export interface BidsByUserResponse {
  bids: Array<BidResponse>;
}
