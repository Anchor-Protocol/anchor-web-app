import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/community#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/community#configresponse
 */
export interface ConfigResponse {
  gov_contract: HumanAddr;
  anchor_token: HumanAddr;
  spend_limit: uANC;
}
