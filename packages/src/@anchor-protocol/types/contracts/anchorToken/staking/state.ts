import { uANC } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#state
 */
export interface State {
  state: {
    block_height?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#stateresponse
 */
export interface StateResponse {
  last_distributed: number;
  total_bond_amount: uANC;
  global_reward_index: Num;
}
