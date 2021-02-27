import { HolderResponse } from '@anchor-protocol/types/contracts/bluna/reward/holder';
import { HumanAddr } from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#holders
 */
export interface Holders {
  holders: {
    start_after: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/bluna/reward#holdersresponse
 */
export interface HoldersResponse {
  holders: Array<HolderResponse>;
}
