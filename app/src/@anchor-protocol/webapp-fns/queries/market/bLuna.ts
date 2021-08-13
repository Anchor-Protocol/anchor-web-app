import {
  DateTime,
  Rate,
  ubLuna,
  uLuna,
  UST,
  uUST,
} from '@anchor-protocol/types';

export interface MarketBLunaData {
  last_processed_batch: number;
  prev_hub_balance: ubLuna;
  hub_luna_balance: uLuna;
  last_updated_base: number;
  total_bond_amount: ubLuna;
  undelegation_batch_id: number;
  timestamp: number;
  bLuna_price: UST;
  exchange_rate: Rate;
  actual_unbonded_amount: ubLuna;
  height: number;
  total_balance: ubLuna;
  requested_with_fee: uUST;
  total_collateral: ubLuna;
  reward_ust_balance: uUST;
  bLuna_total_supply: ubLuna;
  global_index: Rate;
  last_updated_quote: number;
  last_unbonded_time: DateTime;
  prev_reward_balance: ubLuna;
}

export interface MarketBLunaQueryParams {
  endpoint: string;
}

export function marketBLunaQuery({
  endpoint,
}: MarketBLunaQueryParams): Promise<MarketBLunaData> {
  return fetch(`${endpoint}/bassets/bluna`).then((res) => res.json());
}
