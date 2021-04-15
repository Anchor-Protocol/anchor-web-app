import { fabricateMarketBorrow } from '@anchor-protocol/anchor.js';
import { HumanAddr } from '@anchor-protocol/types';
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
import { passTxInfo } from 'pages/borrow/transactions/passTxInfo';
import { pickBorrowResult } from 'pages/borrow/transactions/pickBorrowResult';
import { refetchMarket } from 'pages/borrow/transactions/refetchMarket';

interface DependencyList {
  walletAddress: HumanAddr;
}

export const borrowOptions = createOperationOptions({
  id: 'borrow/borrow',
  pipe: ({
    address,
    addressProvider,
    post,
    client,
    walletAddress,
    signal,
    storage,
    gasAdjustment,
    gasFee,
    fixedGas,
  }: OperationDependency<DependencyList>) => [
    effect(fabricateMarketBorrow, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<TxResult>
    getTxInfo(client, signal), // -> { TxResult, TxInfo }
    merge(
      passTxInfo,
      refetchMarket(address, client, walletAddress), // -> { loanAmount, borrowInfo... }
      injectTxFee(storage), // -> { txFee }
    ),
    pickBorrowResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
