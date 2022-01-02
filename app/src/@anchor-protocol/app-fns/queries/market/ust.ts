import { aUST, bLuna, Rate, u, UST } from '@anchor-protocol/types';

export interface MarketUstData {
  borrow_rate: Rate;
  prev_aterra_supply: u<aUST>;
  deposit_rate: Rate;
  last_reward_updated: number;
  last_executed_height: number;
  last_interest_updated: number;
  total_liabilities: u<UST>;
  base_rate: Rate;
  utilization_ratio: Rate;
  prev_exchange_rate: Rate;
  market_ust_balance: u<UST>;
  custody_bluna_balance: u<bLuna>;
  exchange_rate: Rate;
  prev_interest_buffer: '4703286025726';
  aterra_supply: u<aUST>;
  overseer_ust_balance: u<UST>;
  anc_emission_rate: Rate;
  real_deposit_rate: Rate;
  interest_multiplier: Rate;
  total_reserves: '5959917018.269984176356009487';
  global_reward_index: Rate;
  global_interest_index: Rate;
}

export interface MarketUstQueryParams {
  endpoint: string;
}

export function marketUstQuery({
  endpoint,
}: MarketUstQueryParams): Promise<MarketUstData> {
  return fetch(`${endpoint}/v1/market/ust`).then((res) => res.json());
}
