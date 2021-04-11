import { fabricateMarketDepositStableCoin } from '@anchor-protocol/anchor.js';
import { floor } from '@terra-dev/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickDepositResult } from 'pages/earn/transactions/pickDepositResult';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'base/transactions/takeTxFee';
import { parseTxResult } from 'base/transactions/tx';

export const depositOptions = createOperationOptions({
  id: 'earn/deposit',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    effect(fabricateMarketDepositStableCoin, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
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
    pickDepositResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
