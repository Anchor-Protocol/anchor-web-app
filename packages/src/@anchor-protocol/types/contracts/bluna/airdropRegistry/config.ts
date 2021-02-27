import { Denom, HumanAddr } from '@anchor-protocol/types/contracts/common';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner: HumanAddr;
  hub_contract: HumanAddr;
  reward_contract: HumanAddr;
  airdrop_tokens: Array<Denom>;
}
