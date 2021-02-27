import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#distributionparams
 */
export interface DistributionParams {
  distribution_params: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#distributionparamsresponse
 */
export interface DistributionParamsResponse {
  deposit_rate: Rate;
  target_deposit_rate: Rate;
  threshold_deposit_rate: Rate;
}
