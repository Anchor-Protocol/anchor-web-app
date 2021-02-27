import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#ancemissionrate
 */
export interface AncEmissionRate {
  anc_emission_rate: {
    deposit_rate: Rate;
    target_deposit_rate: Rate;
    current_emission_rate: Rate;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#ancemissionrateresponse
 */
export interface AncEmissionRateResponse {
  emission_rate: Rate;
}
