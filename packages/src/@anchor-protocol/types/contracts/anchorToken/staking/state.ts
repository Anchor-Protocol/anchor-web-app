import { uANC } from '@anchor-protocol/types/currencies';
import { Num } from '@anchor-protocol/types/units';

export interface State {
  state: {
    block_height?: number;
  };
}

export interface StateResponse {
  last_distributed: number;
  total_bond_amount: uANC;
  global_reward_index: Num;
}
