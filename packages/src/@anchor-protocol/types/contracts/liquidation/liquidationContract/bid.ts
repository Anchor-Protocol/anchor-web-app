import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uUST } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bid
 */
export interface Bid {
  collateral_token: HumanAddr;
  bidder: HumanAddr;
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidresponse
 */
export interface BidResponse {
  collateral_token: HumanAddr;
  bidder: HumanAddr;
  amount: uUST;
  premium_rate: Rate;
}
