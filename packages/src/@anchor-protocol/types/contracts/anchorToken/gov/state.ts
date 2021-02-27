import { uANC } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

export interface State {
  state: {};
}

export interface StateResponse {
  poll_count: number;
  total_share: Num;
  total_deposit: uANC;
}
