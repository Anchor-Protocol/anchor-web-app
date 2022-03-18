import { JSDateTime, u, UST } from '@anchor-protocol/types';
import { group } from 'd3-array';
import { gmt9am } from 'utils/gmt9am';

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
  const deposit: MarketDepositRaw = await fetch(`${endpoint}/v1/deposit`).then(
    (res) => res.json(),
  );

  const depositHistory: MarketDepositHistoryRaw = await fetch(
    `${endpoint}/v1/deposit/1d`,
  ).then((res) => res.json());

  const borrow: MarketBorrowRaw = await fetch(`${endpoint}/v1/borrow`).then(
    (res) => res.json(),
  );

  const borrowHistory: MarketBorrowHistoryRaw = await fetch(
    `${endpoint}/v1/borrow/1d`,
  ).then((res) => res.json());

  const now = {
    total_ust_deposits: deposit.total_ust_deposits,
    total_borrowed: borrow.total_borrowed,
    timestamp: Date.now() as JSDateTime,
  };

  const deposits = group(depositHistory.total_ust_deposits, (k) =>
    gmt9am(k.timestamp),
  );

  const borrowings = group(borrowHistory, (k) => gmt9am(k.timestamp));

  const combined = Array.from(deposits).map(([timestamp, deposit]) => {
    const borrowing = borrowings.get(timestamp);
    return {
      timestamp: timestamp as JSDateTime,
      total_ust_deposits: deposit[0].deposit,
      total_borrowed: borrowing ? borrowing[0].total_borrowed : ('0' as u<UST>),
    };
  });

  return {
    now,
    history: combined.sort((a, b) => a.timestamp - b.timestamp),
  };
}
