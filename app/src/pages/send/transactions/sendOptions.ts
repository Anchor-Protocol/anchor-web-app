import { fabricateCw20Transfer } from '@anchor-protocol/anchor.js';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  OperationStop,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { Token } from '@anchor-protocol/types';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickSwapResult } from 'pages/basset/transactions/pickSwapResult';
import { CurrencyInfo } from 'pages/send/models/currency';
import { createOptions } from 'transactions/createOptions';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { parseTxResult } from 'transactions/tx';

export const sendOptions = createOperationOptions({
  id: 'earn/deposit',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
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
    }): MsgExecuteContract[] => {
      if (!!currency.cw20Address) {
        return fabricateCw20Transfer({
          amount,
          address: myAddress,
          contractAddress: currency.cw20Address,
          recipient: toAddress,
        });
      } else {
        throw new OperationStop();
      }
    }, // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickSwapResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  breakOnError: true,
});
