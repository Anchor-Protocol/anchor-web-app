import { HumanAddr } from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#configresponse
 */
export interface ConfigResponse {
  owner: HumanAddr;
  reward_contract?: HumanAddr;
  token_contract?: HumanAddr;
  airdrop_registry_contract?: HumanAddr;
}
