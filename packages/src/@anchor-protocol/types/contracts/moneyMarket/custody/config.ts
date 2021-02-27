import {
  bAssetDenom,
  HumanAddr,
  StableDenom,
} from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#configresponse
 */
export interface ConfigResponse {
  owner: HumanAddr;
  collateral_token: HumanAddr;
  overseer_contract: HumanAddr;
  market_contract: HumanAddr;
  reward_contract: HumanAddr;
  liquidation_contract: HumanAddr;
  stable_denom: StableDenom;
  basset_info: {
    name: string;
    symbol: bAssetDenom;
    decimals: number;
  };
}
