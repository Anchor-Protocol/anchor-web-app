import { Rate } from '../../../units';
import { HumanAddr, StableDenom } from '../../common';

export interface Config {
  config: {};
}

export interface ConfigResponse {
  owner_addr: HumanAddr;
  aterra_contract: HumanAddr;
  interest_model: HumanAddr;
  distribution_model: HumanAddr;
  overseer_contract: HumanAddr;
  collector_contract: HumanAddr;
  faucet_contract: HumanAddr;
  stable_denom: StableDenom;
  reserve_factor: Rate;
  max_borrow_factor: Rate;
}
