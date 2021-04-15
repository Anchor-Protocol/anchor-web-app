import { fabricateCw20Transfer } from '@anchor-protocol/anchor.js';
import { Token, uUST } from '@anchor-protocol/types';
import { floor } from '@terra-dev/big-math';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { Coin, Dec, Int, Msg, MsgSend, StdFee } from '@terra-money/terra.js';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { pickEmptyResult } from 'base/transactions/pickEmptyResult';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { CurrencyInfo } from 'pages/send/models/currency';

export const sendOptions = createOperationOptions({
  id: 'send/send',
  pipe: ({
    post,
    client,
    signal,
    gasFee,
    gasAdjustment,
    fixedGas,
    storage,
  }: OperationDependency<{}>) => {
    let hoistedMemo: string | undefined;

    return [
      ({
        myAddress,
        toAddress,
        currency,
        memo,
        amount,
        txFee,
      }: {
        myAddress: string;
        toAddress: string;
        currency: CurrencyInfo;
        memo?: string;
        amount: Token;
        txFee: uUST;
      }): Msg[] => {
        hoistedMemo = memo;

        storage.set('txFee', txFee);

        if (!!currency.cw20Address) {
          return fabricateCw20Transfer({
            amount,
            address: myAddress,
            contract_address: currency.cw20Address,
            recipient: toAddress,
          });
        } else {
          return [
            new MsgSend(myAddress, toAddress, [
              new Coin(
                `u${currency.value}`,
                new Int(new Dec(amount).mul(1000000)).toString(),
              ),
            ]),
          ];
        }
      }, // -> Msg[]
      merge(
        createOptions(() => ({
          fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
          gasAdjustment,
        })), // -> CreateTxOptions
        () => ({ memo: hoistedMemo }), // -> { memo?: stirng }
      ),
      timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<TxResult>
      merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
      pickEmptyResult, // -> TransactionResult
    ];
  },
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
