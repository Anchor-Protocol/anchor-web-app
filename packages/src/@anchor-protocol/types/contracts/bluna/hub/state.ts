import { uLuna } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

export interface State {
  state: {};
}

export interface StateResponse {
  exchange_rate: Rate;
  total_bond_amount: uLuna;
  last_index_modification: number;
  prev_hub_balance: uLuna;
  actual_unbonded_amount: uLuna;
  last_unbonded_time: number;
  last_processed_batch: number;
}
