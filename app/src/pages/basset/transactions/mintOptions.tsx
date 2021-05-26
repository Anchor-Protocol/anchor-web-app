import { fabricatebAssetBond } from '@anchor-protocol/anchor.js';
import { floor } from '@terra-dev/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'base/transactions/takeTxFee';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickMintResult } from 'pages/basset/transactions/pickMintResult';

export const mintOptions = createOperationOptions({
  id: 'basset/mint',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
    gasAdjustment,
    gasFee,
  }: OperationDependency<{}>) => [
    effect(fabricatebAssetBond, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<TxResult>
    merge(getTxInfo(client, signal), injectTxFee(storage)), // -> { TxResult, TxInfo, txFee }
    pickMintResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
