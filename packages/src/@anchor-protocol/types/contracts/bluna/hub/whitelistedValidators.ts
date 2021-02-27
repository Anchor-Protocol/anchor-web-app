import { HumanAddr } from '@anchor-protocol/types/contracts/common';

export interface WhitelistedValidators {
  whitelisted_validators: {};
}

export interface WhitelistedValidatorsResponse {
  validators: HumanAddr[];
}
