import { AssetDenom, Denom } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface Parameters {
  parameters: {};
}

export interface ParametersResponse {
  epoch_period: number;
  underlying_coin_denom: AssetDenom;
  unbonding_period: number;
  peg_recovery_fee: Rate;
  er_threshold: Rate;
  reward_denom: Denom;
}
