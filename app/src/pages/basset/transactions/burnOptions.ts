import { fabricatebAssetBurn } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickBurnResult } from 'pages/basset/transactions/pickBurnResult';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'transactions/takeTxFee';
import { parseTxResult } from 'transactions/tx';

export const burnOptions = createOperationOptions({
  id: 'basset/burn',
  //broadcastWhen: 'always',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
  }: OperationDependency<{}>) => [
    takeTxFee(storage, fabricatebAssetBurn), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 20), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    injectTxFee(storage, getTxInfo(client, signal)), // TxResult -> { TxResult, TxInfo }
    pickBurnResult, // { TxResult, TxInfo } -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
