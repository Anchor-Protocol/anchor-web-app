import {
  HumanAddr,
  StableDenom,
} from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#configresponse
 */
export interface ConfigResponse {
  owner: HumanAddr;
  base_asset: StableDenom;
}
