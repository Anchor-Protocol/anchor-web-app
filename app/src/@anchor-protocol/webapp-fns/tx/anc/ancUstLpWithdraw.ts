import {
  AddressProvider,
  fabricateTerraswapWithdrawLiquidityANC,
} from '@anchor-protocol/anchor.js';
import {
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, AncUstLP, Gas, Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, stripUUSD } from '@libs/formatter';
import {
  MantleFetch,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions, StdFee } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';

export function ancAncUstLpWithdrawTx(
  $: Parameters<typeof fabricateTerraswapWithdrawLiquidityANC>[0] & {
    gasFee: Gas;
    gasAdjustment: Rate<number>;
    fixedGas: u<UST>;
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
      msgs: fabricateTerraswapWithdrawLiquidityANC($)($.addressProvider),
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
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        const burned = pickAttributeValueByKey<u<AncUstLP>>(
          fromContract,
          'withdrawn_share',
        );

        const receivedAnc = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'amount',
          (attrs) => attrs.reverse()[1],
        );
        const receivedUusd = pickAttributeValueByKey<string>(
          transfer,
          'amount',
          (attrs) => attrs.reverse()[0],
        );
        const receivedUst = !!receivedUusd && stripUUSD(receivedUusd);

        const transferAmount = pickAttributeValueByKey<string>(
          transfer,
          'amount',
        );
        const transferFee = transferAmount && stripUUSD(transferAmount);

        const txFee =
          !!transferFee && (big($.fixedGas).plus(transferFee) as u<UST<Big>>);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burned && {
              name: 'Burned',
              value: formatLP(demicrofy(burned)) + ' ANC-UST LP',
            },
            receivedAnc &&
              receivedUst && {
                name: 'Received',
                value:
                  formatANCWithPostfixUnits(demicrofy(receivedAnc)) +
                  ' ANC + ' +
                  formatUSTWithPostfixUnits(demicrofy(receivedUst)) +
                  ' UST',
              },
            helper.txHashReceipt(),
            helper.txFeeReceipt(txFee ? txFee : undefined),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
