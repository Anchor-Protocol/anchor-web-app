import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  gov_contract: HumanAddr;
  terraswap_factory: HumanAddr;
  anchor_token: HumanAddr;
  faucet_contract: HumanAddr;
  reward_weight: Rate;
}
