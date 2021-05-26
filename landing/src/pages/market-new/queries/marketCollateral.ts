import { ubLuna, uUST } from '@anchor-protocol/types';
import { useQuery, UseQueryResult } from 'react-query';
import { REFERSH_INTERVAL } from '../env';

export interface MarketCollateralResponse {
  total_value: uUST;
  collaterals: [
    {
      bluna: ubLuna;
    },
  ];
}

export function queryMarketCollaterals() {
  return fetch(
    `https://anchor-services.vercel.app/api/collaterals`,
  ).then((res) => res.json());
}

export function useMarketCollaterals(): UseQueryResult<MarketCollateralResponse> {
  return useQuery('marketCollaterals', queryMarketCollaterals, {
    refetchInterval: REFERSH_INTERVAL,
  });
}
