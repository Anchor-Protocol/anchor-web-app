import { ANC, JSDateTime, u, UST } from '@anchor-protocol/types';

export interface MarketBuybackData {
  offer_amount: u<UST>;
  buyback_amount: u<ANC>;
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
  return fetch(`${endpoint}/v1/anc/buyback/${time}`).then((res) => res.json());
}
