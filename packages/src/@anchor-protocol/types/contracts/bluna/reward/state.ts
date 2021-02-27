import { ubLuna } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#state
 */
export interface State {
  state: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#stateresponse
 */
export interface StateResponse {
  global_index: Num;
  total_balance: ubLuna;
}
