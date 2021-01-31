import { fabricatebAssetClaim } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickClaimResult } from 'pages/basset/transactions/pickClaimResult';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { parseTxResult } from 'transactions/tx';

export const claimOptions = createOperationOptions({
  id: 'basset/claim',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
  }: OperationDependency<{}>) => [
    fabricatebAssetClaim, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    getTxInfo(client, signal), // -> { TxResult, TxInfo }
    pickClaimResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  breakOnError: true,
});
