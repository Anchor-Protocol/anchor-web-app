import {
  AddressProvider,
  fabricateProvideCollateral,
} from '@anchor-protocol/anchor.js';
import { demicrofy, formatLuna, formatRate } from '@anchor-protocol/notation';
import { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import {
  BorrowBorrowerData,
  BorrowMarketData,
  computeCurrentLtv,
} from '@anchor-protocol/webapp-fns';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@terra-dev/big-math';
import { TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { QueryObserverResult } from 'react-query';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';
import { _fetchBorrowData } from './_fetchBorrowData';

export function borrowProvideCollateralTx(
  $: Parameters<typeof fabricateProvideCollateral>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    txFee: uUST;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    borrowMarketQuery: () => Promise<
      QueryObserverResult<BorrowMarketData | undefined>
    >;
    borrowBorrowerQuery: () => Promise<
      QueryObserverResult<BorrowBorrowerData | undefined>
    >;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper($.txFee);

  return pipe(
    _createTxOptions({
      msgs: fabricateProvideCollateral($)($.addressProvider),
      fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
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

      const rawLog = pickRawLog(txInfo, 1);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const collateralizedAmount = pickAttributeValue<ubLuna>(
          fromContract,
          7,
        );

        const newLtv =
          computeCurrentLtv(
            borrowBorrower.marketBorrowerInfo,
            borrowBorrower.custodyBorrower,
            borrowMarket.oraclePrice,
          ) ?? ('0' as Rate);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            collateralizedAmount && {
              name: 'Collateralized Amount',
              value: formatLuna(demicrofy(collateralizedAmount)) + ' bLuna',
            },
            newLtv && {
              name: 'New LTV',
              value: formatRate(newLtv) + ' %',
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