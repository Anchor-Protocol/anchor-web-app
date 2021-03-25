import { fabricateProvideCollateral } from '@anchor-protocol/anchor.js';
import { floor } from '@terra-dev/big-math';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { WalletStatus } from '@anchor-protocol/wallet-provider';
import { createContractMsg } from 'base/transactions/createContractMsg';
import { createOptions } from 'base/transactions/createOptions';
import { getTxInfo } from 'base/transactions/getTxInfo';
import { postContractMsg } from 'base/transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'base/transactions/takeTxFee';
import { parseTxResult } from 'base/transactions/tx';
import { StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { passTxInfo } from 'pages/borrow/transactions/passTxInfo';
import { pickProvideCollateralResult } from 'pages/borrow/transactions/pickProvideCollateralResult';
import { refetchMarket } from 'pages/borrow/transactions/refetchMarket';
import { OPERATION_TIMEOUT } from 'env';

interface DependencyList {
  walletStatus: WalletStatus;
}

export const provideCollateralOptions = createOperationOptions({
  id: 'borrow/provide-collateral',
  pipe: ({
    address,
    addressProvider,
    post,
    client,
    walletStatus,
    signal,
    storage,
    gasFee,
    gasAdjustment,
  }: OperationDependency<DependencyList>) => [
    effect(fabricateProvideCollateral, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, floor(storage.get('txFee')) + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), OPERATION_TIMEOUT), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    getTxInfo(client, signal), // -> { TxResult, TxInfo }
    merge(
      passTxInfo,
      refetchMarket(address, client, walletStatus), // -> { loanAmount, borrowInfo... }
      injectTxFee(storage), // -> { txFee }
    ),
    pickProvideCollateralResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
