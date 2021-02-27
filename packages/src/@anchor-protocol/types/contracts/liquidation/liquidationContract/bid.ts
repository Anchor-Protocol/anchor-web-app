import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uUST } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

export interface Bid {
  collateral_token: HumanAddr;
  bidder: HumanAddr;
}

export interface BidResponse {
  collateral_token: HumanAddr;
  bidder: HumanAddr;
  amount: uUST;
  premium_rate: Rate;
}
