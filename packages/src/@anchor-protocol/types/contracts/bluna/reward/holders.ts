import { HolderResponse } from '@anchor-protocol/types/contracts/bluna/reward/holder';
import { HumanAddr } from '@anchor-protocol/types/contracts/common';

export interface Holders {
  holders: {
    start_after: HumanAddr;
    limit?: number;
  };
}

export interface HoldersResponse {
  holders: Array<HolderResponse>;
}
