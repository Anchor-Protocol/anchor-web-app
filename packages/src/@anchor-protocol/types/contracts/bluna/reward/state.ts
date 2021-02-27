import { ubLuna } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

export interface State {
  state: {};
}

export interface StateResponse {
  global_index: Num;
  total_balance: ubLuna;
}
