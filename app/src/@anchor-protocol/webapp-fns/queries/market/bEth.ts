import { bEth, DateTime, Rate, u, UST } from '@anchor-protocol/types';

export interface MarketBEthData {
  total_collateral: u<bEth>;
  height: 5187647;
  reward_ust_balance: u<UST>;
  timestamp: DateTime;
  global_index: Rate;
  beth_total_supply: u<bEth>;
  beth_price: UST;
  prev_reward_balance: u<bEth>;
  total_balance: u<bEth>;
}

export interface MarketBEthQueryParams {
  endpoint: string;
}

export function marketBEthQuery({
  endpoint,
}: MarketBEthQueryParams): Promise<MarketBEthData> {
  return fetch(`${endpoint}/bassets/beth`).then((res) => res.json());
}
