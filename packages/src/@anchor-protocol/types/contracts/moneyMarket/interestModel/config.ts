import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner: HumanAddr;
  base_rate: Rate;
  interest_multiplier: Rate;
}
