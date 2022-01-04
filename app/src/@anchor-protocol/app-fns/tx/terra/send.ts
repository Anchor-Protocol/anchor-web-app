import {
  CW20Addr,
  Gas,
  HumanAddr,
  Rate,
  Token,
  u,
  UST,
} from '@anchor-protocol/types';
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
import { Observable } from 'rxjs';

export function terraSendTx($: {
  myWalletAddress: HumanAddr;
  toWalletAddress: HumanAddr;
  currency: { cw20Contract: CW20Addr } | { tokenDenom: string };
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
      msgs:
        'cw20Contract' in $.currency
          ? //? fabricateCw20Transfer({
            //    amount: $.amount,
            //    address: $.myWalletAddress,
            //    contract_address: $.currency.cw20Contract,
            //    recipient: $.toWalletAddress,
            //  })
            [
              new MsgExecuteContract(
                $.myWalletAddress,
                $.currency.cw20Contract,
                {
                  transfer: {
                    recipient: $.toWalletAddress,
                    amount: formatTokenInput($.amount),
                  },
                },
              ),
            ]
          : [
              new MsgSend($.myWalletAddress, $.toWalletAddress, [
                new Coin(
                  `u${$.currency.tokenDenom}`,
                  formatTokenInput($.amount),
                ),
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
          receipts: [helper.txHashReceipt()],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
