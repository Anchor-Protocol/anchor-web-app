import { floor } from '@libs/big-math';
import { HumanAddr, Rate, terraswap, Token, u, UST } from '@libs/types';
import { pipe } from '@rx-stream/pipe';
import { Coin, MsgExecuteContract, MsgSend, Fee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '../../models/tx';
import { pickEvent, pickRawLog } from '../../queries/txInfo';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '../internal';
import { TxCommonParams } from '../TxCommonParams';

export function sendTx(
  $: {
    walletAddr: HumanAddr;
    toAddr: HumanAddr;
    asset: terraswap.AssetInfo;
    memo?: string;
    amount: u<Token>;
    txFee: u<UST>;
    taxRate: Rate;
    maxTaxUUSD: u<UST>;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs:
        'native_token' in $.asset
          ? [
              new MsgSend($.walletAddr, $.toAddr, [
                new Coin($.asset.native_token.denom, $.amount),
              ]),
            ]
          : [
              new MsgExecuteContract(
                $.walletAddr,
                $.asset.token.contract_addr,
                {
                  transfer: {
                    recipient: $.toAddr,
                    amount: $.amount,
                  },
                },
              ),
            ],
      fee: new Fee($.gasWanted, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
      memo: $.memo,
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
        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            helper.txHashReceipt(),
            //helper.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
