import { HumanAddr } from '../../common';
import { BorrowInfoResponse } from './borrowInfo';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowinfos
 */
export interface BorrowInfos {
  borrower_infos: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowerinfosresponse
 */
export interface BorrowInfosResponse {
  borrower_infos: Array<BorrowInfoResponse>;
}
