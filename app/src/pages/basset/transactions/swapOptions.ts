import { fabricatebSwapbLuna } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
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
    takeSwapFee(storage, fabricatebSwapbLuna), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 20), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    injectSwapFee(storage, getTxInfo(client, signal)), // TxResult -> { TxResult, TxInfo }
    pickSwapResult, // { TxResult, TxInfo } -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
