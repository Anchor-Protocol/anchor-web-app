import { ubLuna } from '@anchor-protocol/types/currencies';

export interface CurrentBatch {
  current_batch: {};
}

export interface CurrentBatchResponse {
  id: number;
  requested_with_fee: ubLuna;
}
