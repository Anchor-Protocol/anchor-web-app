import { Gas, HumanAddr, Rate, Token, u, UST } from '@anchor-protocol/types';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { formatTokenInput } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  Coin,
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
  MsgSend,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { CurrencyInfo } from 'pages/send/models/currency';
import { Observable } from 'rxjs';

export function terraSendTx($: {
  myWalletAddress: HumanAddr;
  toWalletAddress: HumanAddr;
  currency: CurrencyInfo;
  memo?: string;
  amount: Token;
  gasFee: Gas;
  gasAdjustment: Rate<number>;
  txFee: u<UST>;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: $.currency.cw20Address
        ? //? fabricateCw20Transfer({
          //    amount: $.amount,
          //    address: $.myWalletAddress,
          //    contract_address: $.currency.cw20Contract,
          //    recipient: $.toWalletAddress,
          //  })
          [
            new MsgExecuteContract($.myWalletAddress, $.currency.cw20Address, {
              transfer: {
                recipient: $.toWalletAddress,
                amount: formatTokenInput($.amount),
              },
            }),
          ]
        : [
            new MsgSend($.myWalletAddress, $.toWalletAddress, [
              new Coin(`u${$.currency.value}`, formatTokenInput($.amount)),
            ]),
          ],
      fee: new Fee($.gasFee, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
      memo: $.memo,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    () => {
      try {
        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            {
              name: 'Amount',
              value: `${$.amount} ${$.currency.label}`,
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
