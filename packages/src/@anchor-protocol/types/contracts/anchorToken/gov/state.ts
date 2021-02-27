import { uANC } from '@anchor-protocol/types/currencies';

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
  total_share: uANC;
  total_deposit: uANC;
}
