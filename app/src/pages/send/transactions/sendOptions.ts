import { fabricateCw20Transfer } from '@anchor-protocol/anchor.js';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { Token } from '@anchor-protocol/types';
import { Coin, Dec, Int, Msg, MsgSend, StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { CurrencyInfo } from 'pages/send/models/currency';
import { createOptions } from '@anchor-protocol/web-contexts/transactions/createOptions';
import { getTxInfo } from '@anchor-protocol/web-contexts/transactions/getTxInfo';
import { pickEmptyResult } from '@anchor-protocol/web-contexts/transactions/pickEmptyResult';
import { postContractMsg } from '@anchor-protocol/web-contexts/transactions/postContractMsg';
import { parseTxResult } from '@anchor-protocol/web-contexts/transactions/tx';

export const sendOptions = createOperationOptions({
  id: 'send/send',
  pipe: ({
    post,
    client,
    signal,
    gasFee,
    gasAdjustment,
    fixedGas,
  }: OperationDependency<{}>) => [
    ({
      myAddress,
      toAddress,
      currency,
      amount,
    }: {
      myAddress: string;
      toAddress: string;
      currency: CurrencyInfo;
      amount: Token;
    }): Msg[] => {
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
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickEmptyResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  breakOnError: true,
});
