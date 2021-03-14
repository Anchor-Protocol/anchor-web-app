import { Rate } from '../../../units';
import { HumanAddr, StableDenom } from '../../common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#config-1
 */
export interface Config {
  config: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#configresponse
 */
export interface ConfigResponse {
  owner_addr: HumanAddr;
  aterra_contract: HumanAddr;
  interest_model: HumanAddr;
  distribution_model: HumanAddr;
  overseer_contract: HumanAddr;
  collector_contract: HumanAddr;
  distributor_contract: HumanAddr;
  stable_denom: StableDenom;
  reserve_factor: Rate;
  max_borrow_factor: Rate;
}
