import { JSDateTime, ubLuna, uUST } from '@anchor-protocol/types';
import { useQuery, UseQueryResult } from 'react-query';
import { REFRESH_INTERVAL } from '../env';

export interface MarketCollateralsHistory {
  timestamp: JSDateTime;
  total_value: uUST;
  collaterals: [{ bluna: ubLuna }];
}

export interface MarketCollateralsResponse {
  now: MarketCollateralsHistory;
  history: MarketCollateralsHistory[];
}

export async function queryMarketCollaterals() {
  const now: MarketCollateralsHistory = await fetch(
    `https://anchor-services.vercel.app/api/collaterals`,
  )
    .then((res) => res.json())
    .then((data: MarketCollateralsHistory) => ({
      ...data,
      timestamp: Date.now() as JSDateTime,
    }));

  const history: MarketCollateralsHistory[] = await fetch(
    `https://api.anchorprotocol.com/api/collaterals/1d`,
  )
    .then((res) => res.json())
    .then((data: MarketCollateralsHistory[]) => [...data.reverse(), now]);

  return {
    now,
    history,
  };
}

export function useMarketCollaterals(): UseQueryResult<MarketCollateralsResponse> {
  return useQuery('marketCollaterals', queryMarketCollaterals, {
    refetchInterval: REFRESH_INTERVAL,
  });
}
