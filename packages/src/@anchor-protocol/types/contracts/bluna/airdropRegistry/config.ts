import { Denom, HumanAddr } from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/airdrop-registry#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/airdrop-registry#configresponse
 */
export interface ConfigResponse {
  owner: HumanAddr;
  hub_contract: HumanAddr;
  reward_contract: HumanAddr;
  airdrop_tokens: Array<Denom>;
}
