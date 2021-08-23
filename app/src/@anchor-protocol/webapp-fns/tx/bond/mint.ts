import {
  AddressProvider,
  fabricatebAssetBond,
} from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
} from '@anchor-protocol/notation';
import { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import big, { BigSource } from 'big.js';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';

export function bondMintTx(
  $: Parameters<typeof fabricatebAssetBond>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    fixedGas: uUST;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: fabricatebAssetBond($)($.addressProvider),
      fee: new StdFee($.gasFee, $.fixedGas + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLog = pickRawLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const bondedAmount = pickAttributeValue<uLuna>(fromContract, 3);

        const mintedAmount = pickAttributeValue<ubLuna>(fromContract, 4);

        const exchangeRate =
          bondedAmount &&
          mintedAmount &&
          (big(bondedAmount).div(mintedAmount) as Rate<BigSource> | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            bondedAmount && {
              name: 'Bonded Amount',
              value: formatLuna(demicrofy(bondedAmount)) + ' LUNA',
            },
            mintedAmount && {
              name: 'Minted Amount',
              value: formatLuna(demicrofy(mintedAmount)) + ' bLUNA',
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: formatFluidDecimalPoints(exchangeRate, 6),
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
