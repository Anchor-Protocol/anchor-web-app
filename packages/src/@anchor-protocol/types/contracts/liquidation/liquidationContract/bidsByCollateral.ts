import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { BidResponse } from '@anchor-protocol/types/contracts/liquidation/liquidationContract/bid';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbycollateral
 */
export interface BidsByCollateral {
  bids_by_collateral: {
    collateral_token: HumanAddr;
    start_after?: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbycollateralresponse
 */
export interface BidsByCollateralResponse {
  bids: Array<BidResponse>;
}
