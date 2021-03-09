import { fabricateGovCreatePoll } from '@anchor-protocol/anchor.js';
import { floor } from '@anchor-protocol/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { createContractMsg } from '@anchor-protocol/web-contexts/transactions/createContractMsg';
import { createOptions } from '@anchor-protocol/web-contexts/transactions/createOptions';
import { getTxInfo } from '@anchor-protocol/web-contexts/transactions/getTxInfo';
import { pickEmptyResult } from '@anchor-protocol/web-contexts/transactions/pickEmptyResult';
import { postContractMsg } from '@anchor-protocol/web-contexts/transactions/postContractMsg';
import {
  injectTxFee,
  takeTxFee,
} from '@anchor-protocol/web-contexts/transactions/takeTxFee';
import { parseTxResult } from '@anchor-protocol/web-contexts/transactions/tx';

export const createPollOptions = createOperationOptions({
  id: 'gov/create-poll',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    effect(fabricateGovCreatePoll, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(
      getTxInfo(client, signal), // -> { TxResult, TxInfo }
      injectTxFee(storage), // -> { txFee }
    ),
    pickEmptyResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
