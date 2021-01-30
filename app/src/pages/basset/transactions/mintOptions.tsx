import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickMintResult } from 'pages/basset/transactions/pickMintResult';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'transactions/takeTxFee';
import { parseTxResult } from 'transactions/tx';

export const mintOptions = createOperationOptions({
  id: 'basset/mint',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
  }: OperationDependency<{}>) => [
    takeTxFee(storage, fabricatebAssetBond), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    injectTxFee(storage, getTxInfo(client, signal)), // TxResult -> { TxResult, TxInfo }
    pickMintResult, // { TxResult, TxInfo } -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
