import { fabricatebAssetClaimRewards } from '@anchor-protocol/anchor.js';
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
import { pickClaimResult } from 'pages/basset/transactions/pickClaimResult';

export const claimOptions = createOperationOptions({
  id: 'basset/claim',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    fabricatebAssetClaimRewards, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<TxResult>
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickClaimResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
