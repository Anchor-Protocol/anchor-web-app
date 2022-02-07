import {
  computeLtv,
  computeBorrowLimit,
  computeBorrowedAmount,
} from '@anchor-protocol/app-fns';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Gas, HumanAddr, Rate, u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { demicrofy, formatRate, formatTokenInput } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  Coin,
  Coins,
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { QueryObserverResult } from 'react-query';
import { Observable } from 'rxjs';
import { BorrowBorrower } from '../../queries/borrow/borrower';
import { BorrowMarket } from '../../queries/borrow/market';
import { _fetchBorrowData } from './_fetchBorrowData';

export function borrowRepayTx($: {
  walletAddr: HumanAddr;
  marketAddr: HumanAddr;
  repayAmount: UST;

  gasFee: Gas;
  gasAdjustment: Rate<number>;
  txFee: u<UST>;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  borrowMarketQuery: () => Promise<
    QueryObserverResult<BorrowMarket | undefined>
  >;
  borrowBorrowerQuery: () => Promise<
    QueryObserverResult<BorrowBorrower | undefined>
  >;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract(
          $.walletAddr,
          $.marketAddr,
          {
            // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/market/src/msg.rs#L74
            repay_stable: {},
          },
          // sending stablecoin
          new Coins([new Coin('uusd', formatTokenInput($.repayAmount))]),
        ),
      ],
      // FIXME repay's txFee is not fixed_gas (user ust transfer)
      fee: new Fee($.gasFee, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    _fetchBorrowData({ helper, ...$ }),
    ({ value: { txInfo, borrowMarket, borrowBorrower } }) => {
      if (!borrowMarket || !borrowBorrower) {
        return helper.failedToCreateReceipt(
          new Error('Failed to load borrow data'),
        );
      }

      const rawLog = pickRawLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const repaidAmount = pickAttributeValue<u<UST>>(fromContract, 3);

        const ltv = computeLtv(
          computeBorrowLimit(
            borrowBorrower.overseerCollaterals,
            borrowMarket.oraclePrices,
            borrowMarket.bAssetLtvs,
          ),
          computeBorrowedAmount(borrowBorrower.marketBorrowerInfo),
        );

        const outstandingLoan = borrowBorrower.marketBorrowerInfo.loan_amount;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            repaidAmount && {
              name: 'Repaid Amount',
              value:
                formatUSTWithPostfixUnits(demicrofy(repaidAmount)) + ' UST',
            },
            ltv && {
              name: 'New Borrow Usage',
              value: formatRate(ltv) + ' %',
            },
            outstandingLoan && {
              name: 'Outstanding Loan',
              value:
                formatUSTWithPostfixUnits(demicrofy(outstandingLoan)) + ' UST',
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
