import { bLuna, DateTime, Luna, Rate, u, UST } from '@anchor-protocol/types';

export interface MarketBLunaData {
  last_processed_batch: number;
  prev_hub_balance: u<bLuna>;
  hub_luna_balance: u<Luna>;
  last_updated_base: number;
  total_bond_amount: u<bLuna>;
  undelegation_batch_id: number;
  timestamp: number;
  bLuna_price: UST;
  exchange_rate: Rate;
  actual_unbonded_amount: u<bLuna>;
  height: number;
  total_balance: u<bLuna>;
  requested_with_fee: u<UST>;
  total_collateral: u<bLuna>;
  reward_ust_balance: u<UST>;
  bLuna_total_supply: u<bLuna>;
  global_index: Rate;
  last_updated_quote: number;
  last_unbonded_time: DateTime;
  prev_reward_balance: u<bLuna>;
}

export interface MarketBLunaQueryParams {
  endpoint: string;
}

export function marketBLunaQuery({
  endpoint,
}: MarketBLunaQueryParams): Promise<MarketBLunaData> {
  return fetch(`${endpoint}/bassets/bluna`).then((res) => res.json());
}
