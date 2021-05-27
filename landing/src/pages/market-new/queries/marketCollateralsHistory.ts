import { bLuna, JSDateTime, uUST } from '@anchor-protocol/types';
import { useQuery, UseQueryResult } from 'react-query';
import { REFRESH_INTERVAL } from '../env';

export interface MarketCollateralsHistory {
  timestamp: JSDateTime;
  total_value: uUST;
  collaterals: [{ bluna: bLuna }];
}

export function queryMarketCollateralsHistory() {
  return fetch(`https://api.anchorprotocol.com/api/collaterals/1d`)
    .then((res) => res.json())
    .then((data: MarketCollateralsHistory[]) => data.reverse());
}

export function useMarketCollateralsHistory(): UseQueryResult<
  MarketCollateralsHistory[]
> {
  return useQuery('marketCollateralsHistory', queryMarketCollateralsHistory, {
    refetchInterval: REFRESH_INTERVAL,
  });
}
