import { ubLuna } from '@anchor-protocol/types/currencies';
import { DateTime, Rate } from '@anchor-protocol/types/units';

export interface AllHistory {
  all_history: {
    start_from?: number;
    limit?: number;
  };
}

export interface AllHistoryResponse {
  history: Array<{
    batch_id: number;
    time: DateTime;
    amount: ubLuna;
    applied_exchange_rate: Rate;
    withdraw_rate: Rate;
    released: boolean;
  }>;
}
