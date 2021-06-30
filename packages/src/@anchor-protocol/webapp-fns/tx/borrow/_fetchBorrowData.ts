import {
  TxInfoData,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { QueryObserverResult } from 'react-query';
import { BorrowBorrower } from '../../queries/borrow/borrower';
import { BorrowMarket } from '../../queries/borrow/market';
import { TxHelper } from '../internal/TxHelper';

interface Params {
  helper: TxHelper;
  borrowMarketQuery: () => Promise<
    QueryObserverResult<BorrowMarket | undefined>
  >;
  borrowBorrowerQuery: () => Promise<
    QueryObserverResult<BorrowBorrower | undefined>
  >;
}

export function _fetchBorrowData({
  helper,
  borrowMarketQuery,
  borrowBorrowerQuery,
}: Params) {
  return ({ value: txInfo }: TxResultRendering<TxInfoData>) => {
    return Promise.all([borrowMarketQuery(), borrowBorrowerQuery()]).then(
      ([{ data: borrowMarket }, { data: borrowBorrower }]) => {
        return {
          value: { txInfo, borrowMarket, borrowBorrower },

          phase: TxStreamPhase.SUCCEED,
          receipts: [helper.txHashReceipt(), helper.txFeeReceipt()],
        } as TxResultRendering<{
          txInfo: TxInfoData;
          borrowMarket: BorrowMarket;
          borrowBorrower: BorrowBorrower;
        }>;
      },
    );
  };
}
