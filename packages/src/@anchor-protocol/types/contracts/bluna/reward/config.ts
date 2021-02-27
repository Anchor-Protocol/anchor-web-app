import { Denom, HumanAddr } from '@anchor-protocol/types/contracts/common';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  hub_contract: HumanAddr;
  reward_denom: Denom;
}
