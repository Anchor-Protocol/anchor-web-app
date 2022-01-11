import { bAsset, DateTime, Rate, u, UST } from '@anchor-protocol/types';

export interface MarketBEthData {
  total_collateral: u<bAsset>;
  height: 5187647;
  reward_ust_balance: u<UST>;
  timestamp: DateTime;
  global_index: Rate;
  beth_total_supply: u<bAsset>;
  beth_price: UST;
  prev_reward_balance: u<bAsset>;
  total_balance: u<bAsset>;
}

export interface MarketBEthQueryParams {
  endpoint: string;
}

export function marketBEthQuery({
  endpoint,
}: MarketBEthQueryParams): Promise<MarketBEthData> {
  return fetch(`${endpoint}/v1/bassets/beth`).then((res) => res.json());
}
