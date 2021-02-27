import { Denom, HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/airdrop-registry#airdropinfo
 */
export interface AirdropInfo {
  airdrop_info: {
    airdrop_token?: Denom;
    start_after?: string;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/airdrop-registry#airdropinforesponse
 */
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
