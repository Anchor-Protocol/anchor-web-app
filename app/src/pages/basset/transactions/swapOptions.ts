import { fabricatebSwapbLuna } from '@anchor-protocol/anchor.js/fabricators';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickSwapResult } from 'pages/basset/transactions/pickSwapResult';
import {
  injectSwapFee,
  takeSwapFee,
} from 'pages/basset/transactions/takeSwapFee';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { parseTxResult } from 'transactions/tx';

export const swapOptions = createOperationOptions({
  id: 'basset/swap',
  //broadcastWhen: 'always',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
    storage,
  }: OperationDependency<{}>) => [
    effect(fabricatebSwapbLuna, takeSwapFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), injectSwapFee(storage)), // -> { TxResult, TxInfo, swapFee }
    pickSwapResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
