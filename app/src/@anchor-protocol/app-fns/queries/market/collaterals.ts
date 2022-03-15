import { bAsset, JSDateTime, u, UST } from '@anchor-protocol/types';
import { dedupeTimestamp } from './utils/dedupeTimestamp';

export interface MarketCollateralsHistory {
  timestamp: JSDateTime;
  total_value: u<UST>;
  collaterals: Array<{
    token: string;
    symbol: string;
    collateral: u<bAsset>;
    price: UST;
  }>;
}

export interface MarketCollateralsData {
  now: MarketCollateralsHistory;
  history: MarketCollateralsHistory[];
}

export type MarketCollateralsQueryParams = {
  endpoint: string;
};

export async function marketCollateralsQuery({
  endpoint,
}: MarketCollateralsQueryParams): Promise<MarketCollateralsData> {
  const now: MarketCollateralsHistory = await fetch(
    `${endpoint}/v2/collaterals`,
  )
    .then((res) => res.json())
    .then((data: MarketCollateralsHistory) => ({
      ...data,
      timestamp: Date.now() as JSDateTime,
    }));

  const history: MarketCollateralsHistory[] = await fetch(
    `${endpoint}/v2/collaterals/1d`,
  )
    .then((res) => res.json())
    .then((data: MarketCollateralsHistory[]) => {
      return [...data.sort((a, b) => a.timestamp - b.timestamp), now];
    });

  return {
    now,
    history: dedupeTimestamp(history, 'timestamp'),
  };
}
