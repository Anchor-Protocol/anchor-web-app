import { fabricateTerraswapWithdrawLiquidityANC } from '@anchor-protocol/anchor.js';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickAncUstLpWithdrawResult } from 'pages/gov/transactions/pickAncUstLpWithdrawResult';

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
  }: OperationDependency<{}>) => [
    fabricateTerraswapWithdrawLiquidityANC, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<StringifiedTxResult>
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickAncUstLpWithdrawResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
