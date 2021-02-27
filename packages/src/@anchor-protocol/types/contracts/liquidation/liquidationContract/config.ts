import {
  HumanAddr,
  StableDenom,
} from '@anchor-protocol/types/contracts/common';
import { Num, Rate } from '@anchor-protocol/types/units';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner: HumanAddr;
  oracle_contract: HumanAddr;
  stable_denom: StableDenom;
  safe_ratio: Rate;
  bid_fee: Rate;
  max_premium_rate: Rate;
  liquidation_threshold: Num;
  price_timeframe: number;
}
