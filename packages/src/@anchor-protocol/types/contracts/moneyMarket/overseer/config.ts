import {
  HumanAddr,
  StableDenom,
} from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner_addr: HumanAddr;
  oracle_contract: HumanAddr;
  market_contract: HumanAddr;
  liquidation_contract: HumanAddr;
  collector_contract: HumanAddr;
  distribution_threshold: Rate;
  target_deposit_rate: Rate;
  buffer_distribution_rate: Rate;
  anc_purchase_factor: Rate;
  stable_denom: StableDenom;
  epoch_period: number;
  price_timeframe: number;
}
