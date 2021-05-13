import { uUST } from '@anchor-protocol/types';
import { REFERSH_INTERVAL } from 'pages/market-new/env';
import { useQuery, UseQueryResult } from 'react-query';

export interface MarketBorrowResponse {
  total_borrowed: uUST;
  borrowers: {
    last_updated: number;
    borrowers: number;
  };
}

export function queryMarketBorrow() {
  return fetch(`https://anchor-services.vercel.app/api/borrow`).then((res) =>
    res.json(),
  );
}

export function useMarketBorrow(): UseQueryResult<MarketBorrowResponse> {
  return useQuery('marketBorrow', queryMarketBorrow, {
    refetchInterval: REFERSH_INTERVAL,
  });
}
