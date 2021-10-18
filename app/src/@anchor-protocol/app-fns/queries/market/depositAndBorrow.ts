import { JSDateTime, u, UST } from '@anchor-protocol/types';
import { dedupeTimestamp } from './utils/dedupeTimestamp';

interface MarketDepositRaw {
  total_ust_deposits: u<UST>;
  total_depositors: {
    last_updated: number;
    holders: number;
  };
}

interface MarketDepositHistoryRaw {
  total_ust_deposits: Array<{
    deposit: u<UST>;
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
  total_borrowed: u<UST>;
  borrowers: {
    last_updated: number;
    borrowers: number;
  };
}

type MarketBorrowHistoryRaw = Array<{
  total_borrowed: u<UST>;
  timestamp: JSDateTime;
}>;

export interface MarketDepositAndBorrow {
  total_ust_deposits: u<UST>;
  total_borrowed: u<UST>;
  timestamp: JSDateTime;
}

export interface MarketDepositAndBorrowData {
  now: MarketDepositAndBorrow;
  history: MarketDepositAndBorrow[];
}

export interface MarketDepositAndBorrowQueryParams {
  endpoint: string;
}

export async function marketDepositAndBorrowQuery({
  endpoint,
}: MarketDepositAndBorrowQueryParams): Promise<MarketDepositAndBorrowData> {
  const deposit: MarketDepositRaw = await fetch(`${endpoint}/deposit`).then(
    (res) => res.json(),
  );

  const depositHistory: MarketDepositHistoryRaw = await fetch(
    `${endpoint}/deposit/1d`,
  ).then((res) => res.json());

  const borrow: MarketBorrowRaw = await fetch(`${endpoint}/borrow`).then(
    (res) => res.json(),
  );

  const borrowHistory: MarketBorrowHistoryRaw = await fetch(
    `${endpoint}/borrow/1d`,
  ).then((res) => res.json());

  const now = {
    total_ust_deposits: deposit.total_ust_deposits,
    total_borrowed: borrow.total_borrowed,
    timestamp: Date.now() as JSDateTime,
  };

  const combined = [
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
  ];

  return {
    now,
    history: dedupeTimestamp(combined, 'timestamp'),
  };
}
