import { uUST } from '../../../currencies';
import { Num, Rate } from '../../../units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#state
 */
export interface State {
  state: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#stateresponse
 */
export interface StateResponse {
  total_liabilities: uUST;
  total_reserves: uUST;
  last_interest_updated: number;
  last_reward_updated: number;
  global_interest_index: Num;
  global_reward_index: Num;
  anc_emission_rate: Rate;
}
