import { JSDateTime, uUST } from '@anchor-protocol/types';
import { REFRESH_INTERVAL } from 'pages/market-new/env';
import { useQuery, UseQueryResult } from 'react-query';

export interface MarketDepositHistory {
  total_ust_deposits: Array<{
    deposit: uUST;
    liability: '74481041162848.589699372014181516';
    timestamp: JSDateTime;
  }>;
  total_depositors: Array<{
    last_updated: JSDateTime;
    holders: 14232;
    height: 3125366;
    timestamp: JSDateTime;
  }>;
}

export interface MarketBorrowHistory {
  total_borrowed: uUST;
  timestamp: JSDateTime;
}

export interface MarketDepositAndBorrowHistory {
  total_ust_deposit_and_borrow: Array<{
    deposit: uUST;
    total_borrowed: uUST;
    liability: '74481041162848.589699372014181516';
    timestamp: JSDateTime;
  }>;
  total_depositors: Array<{
    last_updated: JSDateTime;
    holders: 14232;
    height: 3125366;
    timestamp: JSDateTime;
  }>;
}

export async function queryMarketDepositAndBorrowHistory(): Promise<MarketDepositAndBorrowHistory> {
  const {
    total_ust_deposits,
    total_depositors,
  }: MarketDepositHistory = await fetch(
    `https://api.anchorprotocol.com/api/deposit/1d`,
  ).then((res) => res.json());

  const borrow: MarketBorrowHistory[] = await fetch(
    `https://api.anchorprotocol.com/api/borrow/1d`,
  ).then((res) => res.json());

  return {
    total_ust_deposit_and_borrow: total_ust_deposits
      .map((total_ust_deposit, i) => {
        return {
          ...total_ust_deposit,
          ...borrow[i],
        };
      })
      .reverse(),
    total_depositors,
  };
}

export function useMarketDepositAndBorrowHistory(): UseQueryResult<MarketDepositAndBorrowHistory> {
  return useQuery(
    'marketDepositAndBorrowHistory',
    queryMarketDepositAndBorrowHistory,
    {
      refetchInterval: REFRESH_INTERVAL,
      keepPreviousData: true,
    },
  );
}
