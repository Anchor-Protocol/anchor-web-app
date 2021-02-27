import { Denom, HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface AirdropInfo {
  airdrop_info: {
    airdrop_token?: Denom;
    start_after?: string;
    limit?: number;
  };
}

export interface AirdropInfoResponse {
  airdrop_info: Array<{
    airdrop_token: Denom;
    info: {
      airdrop_token_contract: HumanAddr;
      airdrop_contract: HumanAddr;
      airdrop_swap_contract: HumanAddr;
      swap_belief_price?: Rate;
      swap_max_spread?: Rate;
    };
  }>;
}
