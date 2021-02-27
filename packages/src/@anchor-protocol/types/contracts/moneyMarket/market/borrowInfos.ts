import { HumanAddr } from '../../common';
import { BorrowInfoResponse } from './borrowInfo';

export interface BorrowInfos {
  borrower_infos: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

export interface BorrowInfosResponse {
  borrower_infos: Array<BorrowInfoResponse>;
}
