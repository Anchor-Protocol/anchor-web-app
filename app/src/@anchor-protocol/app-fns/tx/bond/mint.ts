import {
  AddressProvider,
  fabricatebAssetBond,
} from '@anchor-protocol/anchor.js';
import { formatLuna } from '@anchor-protocol/notation';
import { bLuna, Gas, Luna, Rate, u, UST } from '@anchor-protocol/types';
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
import { demicrofy, formatFluidDecimalPoints } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import big, { BigSource } from 'big.js';
import { Observable } from 'rxjs';

export function bondMintTx(
  $: Parameters<typeof fabricatebAssetBond>[0] & {
    gasFee: Gas;
    gasAdjustment: Rate<number>;
    fixedGas: u<UST>;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    queryClient: QueryClient;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: fabricatebAssetBond($)($.addressProvider),
      fee: new StdFee($.gasFee, floor($.fixedGas) + 'uusd'),
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
        const bondedAmount = pickAttributeValue<u<Luna>>(fromContract, 3);

        const mintedAmount = pickAttributeValue<u<bLuna>>(fromContract, 4);

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
