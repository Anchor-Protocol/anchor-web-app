import { uANC } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#state
 */
export interface State {
  state: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#stateresponse
 */
export interface StateResponse {
  poll_count: number;
  total_share: Num;
  total_deposit: uANC;
}
