import { HumanAddr } from '@anchor-protocol/types/contracts/common';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner: HumanAddr;
  reward_contract?: HumanAddr;
  token_contract?: HumanAddr;
  airdrop_registry_contract?: HumanAddr;
}
