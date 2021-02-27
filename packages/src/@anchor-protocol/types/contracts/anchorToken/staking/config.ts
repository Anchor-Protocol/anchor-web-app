import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#configresponse
 */
export interface ConfigResponse {
  anchor_token: HumanAddr;
  staking_token: HumanAddr;
  distribution_schedule: Array<[number, number, uANC]>;
}
