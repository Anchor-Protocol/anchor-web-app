import { fabricatebWithdrawLiquidityANC } from '@anchor-protocol/anchor.js';
import { floor } from '@terra-dev/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { takeTxFee } from 'base/transactions/takeTxFee';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { OPERATION_TIMEOUT } from 'env';
import { pickAncUstLpWithdrawResult } from 'pages/gov/transactions/pickAncUstLpWithdrawResult';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { parseTxResult } from 'base/transactions/tx';

export const ancUstLpWithdrawOptions = createOperationOptions({
  id: 'gov/ancUstLpWithdraw',
  //broadcastWhen: 'always',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
    storage,
  }: OperationDependency<{}>) => [
    effect(fabricatebWithdrawLiquidityANC, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), OPERATION_TIMEOUT), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickAncUstLpWithdrawResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
