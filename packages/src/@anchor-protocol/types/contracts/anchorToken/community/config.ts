import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  gov_contract: HumanAddr;
  anchor_token: HumanAddr;
  spend_limit: uANC;
}
