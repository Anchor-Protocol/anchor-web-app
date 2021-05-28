import { JSDateTime, uUST } from '@anchor-protocol/types';
import { useQuery, UseQueryResult } from 'react-query';
import { REFRESH_INTERVAL } from '../env';

interface MarketDepositRaw {
  total_ust_deposits: uUST;
  total_depositors: {
    last_updated: number;
    holders: number;
  };
}

interface MarketDepositHistoryRaw {
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

interface MarketBorrowRaw {
  total_borrowed: uUST;
  borrowers: {
    last_updated: number;
    borrowers: number;
  };
}

type MarketBorrowHistoryRaw = Array<{
  total_borrowed: uUST;
  timestamp: JSDateTime;
}>;

export interface MarketDepositAndBorrow {
  total_ust_deposits: uUST;
  total_borrowed: uUST;
  timestamp: JSDateTime;
}

export interface MarketDepositAndBorrowResponse {
  now: MarketDepositAndBorrow;
  history: MarketDepositAndBorrow[];
}

export async function queryMarketDepositAndBorrow(): Promise<MarketDepositAndBorrowResponse> {
  const deposit: MarketDepositRaw = await fetch(
    `https://anchor-services.vercel.app/api/deposit`,
  ).then((res) => res.json());

  const depositHistory: MarketDepositHistoryRaw = await fetch(
    `https://api.anchorprotocol.com/api/deposit/1d`,
  ).then((res) => res.json());

  const borrow: MarketBorrowRaw = await fetch(
    `https://anchor-services.vercel.app/api/borrow`,
  ).then((res) => res.json());

  const borrowHistory: MarketBorrowHistoryRaw = await fetch(
    `https://api.anchorprotocol.com/api/borrow/1d`,
  ).then((res) => res.json());

  const now = {
    total_ust_deposits: deposit.total_ust_deposits,
    total_borrowed: borrow.total_borrowed,
    timestamp: Date.now() as JSDateTime,
  };

  return {
    now,
    history: [
      ...depositHistory.total_ust_deposits
        .map(({ deposit, timestamp }, i) => {
          return {
            total_ust_deposits: deposit,
            total_borrowed: borrowHistory[i].total_borrowed,
            timestamp,
          };
        })
        .reverse(),
      now,
    ],
  };
}

export function useMarketDepositAndBorrow(): UseQueryResult<MarketDepositAndBorrowResponse> {
  return useQuery('marketDepositAndBorrow', queryMarketDepositAndBorrow, {
    refetchInterval: REFRESH_INTERVAL,
    keepPreviousData: true,
  });
}
