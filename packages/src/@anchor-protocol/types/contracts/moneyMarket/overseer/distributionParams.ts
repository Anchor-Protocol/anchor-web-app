import { Rate } from '@anchor-protocol/types/units';

export interface DistributionParams {
  distribution_params: {};
}

export interface DistributionParamsResponse {
  deposit_rate: Rate;
  target_deposit_rate: Rate;
  threshold_deposit_rate: Rate;
}
