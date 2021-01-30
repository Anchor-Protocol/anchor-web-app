import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
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
    takeTxFee(storage, fabricateDepositStableCoin), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    injectTxFee(storage, getTxInfo(client, signal)), // TxResult -> { TxResult, TxInfo }
    pickDepositResult, // { TxResult, TxInfo } -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
