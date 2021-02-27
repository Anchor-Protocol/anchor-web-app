import { Denom, HumanAddr } from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#configresponse
 */
export interface ConfigResponse {
  hub_contract: HumanAddr;
  reward_denom: Denom;
}
