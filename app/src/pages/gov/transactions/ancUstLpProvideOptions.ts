import { fabricateTerraSwapProvideLiquidityANC } from '@anchor-protocol/anchor.js';
import { floor } from '@terra-dev/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { Bank } from 'base/contexts/bank';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { takeTxFee } from 'base/transactions/takeTxFee';
import { parseTxResult } from 'base/transactions/tx';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { OPERATION_TIMEOUT } from 'env';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { pickAncUstLpProvideResult } from 'pages/gov/transactions/pickAncUstLpProvideResult';

export const ancUstLpProvideOptions = createOperationOptions({
  id: 'gov/ancUstLpProvide',
  //broadcastWhen: 'always',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
    bank,
    ancPrice,
    storage,
  }: OperationDependency<{ bank: Bank; ancPrice: AncPrice | undefined }>) => [
    effect(fabricateTerraSwapProvideLiquidityANC, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), OPERATION_TIMEOUT), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(
      getTxInfo(client, signal), // -> { TxResult, TxInfo }
      () => ({ fixedGas, bank, ancPrice }), // -> { fixedGas, bank, ancPrice }
    ),
    pickAncUstLpProvideResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
