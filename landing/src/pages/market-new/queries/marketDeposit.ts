import { uUST } from '@anchor-protocol/types';
import { REFRESH_INTERVAL } from 'pages/market-new/env';
import { useQuery, UseQueryResult } from 'react-query';

export interface MarketDepositResponse {
  total_ust_deposits: uUST;
  total_depositors: {
    last_updated: number;
    holders: number;
  };
}

export function queryMarketDeposit() {
  return fetch(`https://anchor-services.vercel.app/api/deposit`).then((res) =>
    res.json(),
  );
}

export function useMarketDeposit(): UseQueryResult<MarketDepositResponse> {
  return useQuery('marketDeposit', queryMarketDeposit, {
    refetchInterval: REFRESH_INTERVAL,
  });
}
