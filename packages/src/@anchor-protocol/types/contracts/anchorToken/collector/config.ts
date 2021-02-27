import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/collector#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/collector#configresponse
 */
export interface ConfigResponse {
  gov_contract: HumanAddr;
  terraswap_factory: HumanAddr;
  anchor_token: HumanAddr;
  faucet_contract: HumanAddr;
  reward_weight: Rate;
}
