import {
  bAssetDenom,
  HumanAddr,
  StableDenom,
} from '@anchor-protocol/types/contracts/common';

export interface Config {
  config: {};
}

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
