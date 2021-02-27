import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  anchor_token: HumanAddr;
  staking_token: HumanAddr;
  distribution_schedule: Array<[number, number, uANC]>;
}
