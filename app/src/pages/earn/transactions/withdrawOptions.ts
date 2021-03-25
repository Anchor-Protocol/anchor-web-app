import { fabricateRedeemStable } from '@anchor-protocol/anchor.js';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { OPERATION_TIMEOUT } from 'env';
import { pickWithdrawResult } from 'pages/earn/transactions/pickWithdrawResult';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'base/transactions/takeTxFee';
import { parseTxResult } from 'base/transactions/tx';

export const withdrawOptions = createOperationOptions({
  id: 'earn/withdarw',
  pipe: ({
    addressProvider,
    post,
    client,
    storage,
    signal,
    gasAdjustment,
    gasFee,
    fixedGas,
  }: OperationDependency<{}>) => [
    effect(fabricateRedeemStable, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), OPERATION_TIMEOUT), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(
      getTxInfo(client, signal), // -> { TxResult, TxInfo }
      injectTxFee(storage), // -> { txFee }
    ),
    pickWithdrawResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
