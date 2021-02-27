import { HumanAddr } from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#whitelistedvalidators
 */
export interface WhitelistedValidators {
  whitelisted_validators: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#whitelistedvalidatorsresponse
 */
export interface WhitelistedValidatorsResponse {
  validators: HumanAddr[];
}
