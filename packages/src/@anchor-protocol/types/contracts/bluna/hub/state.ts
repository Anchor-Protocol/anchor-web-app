import { uLuna } from '@anchor-protocol/types/currencies';
import { DateTime, Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#state
 */
export interface State {
  state: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#stateresponse
 */
export interface StateResponse {
  exchange_rate: Rate;
  total_bond_amount: uLuna;
  last_index_modification: DateTime;
  prev_hub_balance: uLuna;
  actual_unbonded_amount: uLuna;
  last_unbonded_time: DateTime;
  last_processed_batch: number;
}
