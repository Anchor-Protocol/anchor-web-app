import { JSDateTime, uANC, uUST } from '@anchor-protocol/types';

export interface MarketBuybackData {
  offer_amount: uUST;
  buyback_amount: uANC;
  height: number;
  timestamp: JSDateTime;
}

export interface MarketBuybackQueryParams {
  endpoint: string;
  time: '72hrs' | 'total';
}

export function marketBuybackQuery({
  endpoint,
  time,
}: MarketBuybackQueryParams): Promise<MarketBuybackData> {
  return fetch(`${endpoint}/api/anc/buyback/${time}`).then((res) => res.json());
}
