import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#configresponse
 */
export interface ConfigResponse {
  owner: HumanAddr;
  base_rate: Rate;
  interest_multiplier: Rate;
}
