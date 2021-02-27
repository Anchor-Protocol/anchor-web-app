import { Rate } from '@anchor-protocol/types/units';

export interface AncEmissionRate {
  anc_emission_rate: {
    deposit_rate: Rate;
    target_deposit_rate: Rate;
    current_emission_rate: Rate;
  };
}

export interface AncEmissionRateResponse {
  emission_rate: Rate;
}
