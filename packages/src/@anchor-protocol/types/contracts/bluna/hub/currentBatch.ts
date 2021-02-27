import { ubLuna } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#currentbatch
 */
export interface CurrentBatch {
  current_batch: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#currentbatchresponse
 */
export interface CurrentBatchResponse {
  id: number;
  requested_with_fee: ubLuna;
}
