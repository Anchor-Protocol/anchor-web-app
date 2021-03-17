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
import { parseTxResult } from 'base/transactions/tx';
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
  }: OperationDependency<{}>) => [
    ({
      myAddress,
      toAddress,
      currency,
      amount,
      txFee,
    }: {
      myAddress: string;
      toAddress: string;
      currency: CurrencyInfo;
      amount: Token;
      txFee: uUST;
    }): Msg[] => {
      storage.set('txFee', txFee);

      if (!!currency.cw20Address) {
        return fabricateCw20Transfer({
          amount,
          address: myAddress,
          contractAddress: currency.cw20Address,
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
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickEmptyResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
