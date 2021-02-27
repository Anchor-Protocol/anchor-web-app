import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { ubLuna } from '@anchor-protocol/types/currencies';

export interface UnbondRequests {
  unbond_requests: {
    address: HumanAddr;
  };
}

export interface UnbondRequestsResponse {
  address: HumanAddr;
  requests: Array<[number, ubLuna]>;
}
