import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickDepositResult } from 'pages/earn/transactions/pickDepositResult';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'transactions/takeTxFee';
import { parseTxResult } from 'transactions/tx';

export const depositOptions = createOperationOptions({
  id: 'earn/deposit',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
  }: OperationDependency<{}>) => [
    effect(fabricateDepositStableCoin, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), injectTxFee(storage)), // -> { TxResult, TxInfo, txFee }
    pickDepositResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
