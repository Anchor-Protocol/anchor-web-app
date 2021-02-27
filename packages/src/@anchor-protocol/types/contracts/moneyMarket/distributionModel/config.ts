import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner: HumanAddr;
  emission_cap: Rate;
  increment_multiplier: Rate;
  decrement_multiplier: Rate;
}
