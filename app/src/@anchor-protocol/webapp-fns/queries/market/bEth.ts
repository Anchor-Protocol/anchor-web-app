import { DateTime, Rate, ubEth, UST, uUST } from '@anchor-protocol/types';

export interface MarketBEthData {
  total_collateral: ubEth;
  height: 5187647;
  reward_ust_balance: uUST;
  timestamp: DateTime;
  global_index: Rate;
  beth_total_supply: ubEth;
  beth_price: UST;
  prev_reward_balance: ubEth;
  total_balance: ubEth;
}

export interface MarketBEthQueryParams {
  endpoint: string;
}

export function marketBEthQuery({
  endpoint,
}: MarketBEthQueryParams): Promise<MarketBEthData> {
  return fetch(`${endpoint}/bassets/beth`).then((res) => res.json());
}
