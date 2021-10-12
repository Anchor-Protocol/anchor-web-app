import { TxInfoData, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { QueryObserverResult } from 'react-query';
import { BorrowBorrower } from '../../queries/borrow/borrower';
import { BorrowMarket } from '../../queries/borrow/market';

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
