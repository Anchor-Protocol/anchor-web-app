import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { ubLuna } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#unbondrequests
 */
export interface UnbondRequests {
  unbond_requests: {
    address: HumanAddr;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/hub-1#unbondrequestsresponse
 */
export interface UnbondRequestsResponse {
  address: HumanAddr;
  requests: Array<[number, ubLuna]>;
}
