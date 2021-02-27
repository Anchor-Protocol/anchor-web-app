import {
  HumanAddr,
  StableDenom,
} from '@anchor-protocol/types/contracts/common';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner: HumanAddr;
  base_asset: StableDenom;
}
