import { Rate, uaUST, ubLuna, uUST } from '@anchor-protocol/types';
import { REFERSH_INTERVAL } from 'pages/market-new/env';
import { useQuery, UseQueryResult } from 'react-query';

export interface MarketUSTResponse {
  borrow_rate: Rate;
  prev_aterra_supply: uaUST;
  deposit_rate: Rate;
  last_reward_updated: number;
  last_executed_height: number;
  last_interest_updated: number;
  total_liabilities: uUST;
  base_rate: Rate;
  utilization_ratio: Rate;
  prev_exchange_rate: Rate;
  market_ust_balance: uUST;
  custody_bluna_balance: ubLuna;
  exchange_rate: Rate;
  prev_interest_buffer: '4703286025726';
  aterra_supply: uaUST;
  overseer_ust_balance: uUST;
  anc_emission_rate: Rate;
  real_deposit_rate: Rate;
  interest_multiplier: Rate;
  total_reserves: '5959917018.269984176356009487';
  global_reward_index: Rate;
  global_interest_index: Rate;
}

export function queryMarketUST() {
  return fetch(
    `https://anchor-services.vercel.app/api/market/ust`,
  ).then((res) => res.json());
}

export function useMarketUST(): UseQueryResult<MarketUSTResponse> {
  return useQuery('marketUST', queryMarketUST, {
    refetchInterval: REFERSH_INTERVAL,
  });
}
