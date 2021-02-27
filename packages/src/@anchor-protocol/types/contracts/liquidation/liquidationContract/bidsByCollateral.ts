import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { BidResponse } from '@anchor-protocol/types/contracts/liquidation/liquidationContract/bid';

export interface BidsByCollateral {
  bids_by_collateral: {
    collateral_token: HumanAddr;
    start_after?: HumanAddr;
    limit?: number;
  };
}

export interface BidsByCollateralResponse {
  bids: Array<BidResponse>;
}
