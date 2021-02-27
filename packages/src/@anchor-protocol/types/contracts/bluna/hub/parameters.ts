import { AssetDenom, Denom } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#parameters-1
 */
export interface Parameters {
  parameters: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#parametersresponse
 */
export interface ParametersResponse {
  epoch_period: number;
  underlying_coin_denom: AssetDenom;
  unbonding_period: number;
  peg_recovery_fee: Rate;
  er_threshold: Rate;
  reward_denom: Denom;
}
