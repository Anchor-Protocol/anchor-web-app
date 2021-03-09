import { fabricateTerraSwapProvideLiquidityANC } from '@anchor-protocol/anchor.js';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { Bank } from '@anchor-protocol/web-contexts/contexts/bank';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { pickAncUstLpProvideResult } from 'pages/gov/transactions/pickAncUstLpProvideResult';
import { createContractMsg } from '@anchor-protocol/web-contexts/transactions/createContractMsg';
import { createOptions } from '@anchor-protocol/web-contexts/transactions/createOptions';
import { getTxInfo } from '@anchor-protocol/web-contexts/transactions/getTxInfo';
import { postContractMsg } from '@anchor-protocol/web-contexts/transactions/postContractMsg';
import { parseTxResult } from '@anchor-protocol/web-contexts/transactions/tx';

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
  }: OperationDependency<{ bank: Bank; ancPrice: AncPrice | undefined }>) => [
    fabricateTerraSwapProvideLiquidityANC, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<StringifiedTxResult>
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
