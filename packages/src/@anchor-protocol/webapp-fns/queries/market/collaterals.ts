import { JSDateTime, ubLuna, uUST } from '@anchor-protocol/types';

export interface MarketCollateralsHistory {
  timestamp: JSDateTime;
  total_value: uUST;
  collaterals: [{ bluna: ubLuna }];
}

export interface MarketCollateralsData {
  now: MarketCollateralsHistory;
  history: MarketCollateralsHistory[];
}

export interface MarketCollateralsQueryParams {
  endpoint: string;
}

export async function marketCollateralsQuery({
  endpoint,
}: MarketCollateralsQueryParams): Promise<MarketCollateralsData> {
  const now: MarketCollateralsHistory = await fetch(
    `${endpoint}/api/collaterals`,
  )
    .then((res) => res.json())
    .then((data: MarketCollateralsHistory) => ({
      ...data,
      timestamp: Date.now() as JSDateTime,
    }));

  const history: MarketCollateralsHistory[] = await fetch(
    `${endpoint}/api/collaterals/1d`,
  )
    .then((res) => res.json())
    .then((data: MarketCollateralsHistory[]) => [...data.reverse(), now]);

  return {
    now,
    history,
  };
}
