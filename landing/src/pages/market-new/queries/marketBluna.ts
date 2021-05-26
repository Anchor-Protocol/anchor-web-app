import {
  DateTime,
  Rate,
  ubLuna,
  uLuna,
  UST,
  uUST,
} from '@anchor-protocol/types';
import { useQuery, UseQueryResult } from 'react-query';
import { REFERSH_INTERVAL } from '../env';

export interface MarketBlunaResponse {
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
  block_height: number;
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

export function queryMarketBluna() {
  return fetch(
    `https://anchor-services.vercel.app/api/bassets/bluna`,
  ).then((res) => res.json());
}

export function useMarketBluna(): UseQueryResult<MarketBlunaResponse> {
  return useQuery('marketBluna', queryMarketBluna, {
    refetchInterval: REFERSH_INTERVAL,
  });
}
