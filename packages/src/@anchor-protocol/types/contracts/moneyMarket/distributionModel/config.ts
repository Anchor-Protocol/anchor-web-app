import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#configresponse
 */
export interface ConfigResponse {
  owner: HumanAddr;
  emission_cap: Rate;
  increment_multiplier: Rate;
  decrement_multiplier: Rate;
}
