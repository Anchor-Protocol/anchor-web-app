import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/dripper#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/dripper#configresponse
 */
export interface ConfigResponse {
  gov_contract: HumanAddr;
  anchor_token: HumanAddr;
  whitelist: Array<HumanAddr>;
  spend_limit: uANC;
}
