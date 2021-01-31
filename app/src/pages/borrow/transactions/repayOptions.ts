import { fabricateRepay } from '@anchor-protocol/anchor.js/fabricators';
import {
  createOperationOptions,
  effect,
  merge,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { WalletStatus } from '@anchor-protocol/wallet-provider';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickRepayResult } from 'pages/borrow/transactions/pickRepayResult';
import { refetchMarket } from 'pages/borrow/transactions/refetchMarket';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'transactions/takeTxFee';
import { parseTxResult } from 'transactions/tx';

interface DependencyList {
  walletStatus: WalletStatus;
}

export const repayOptions = createOperationOptions({
  id: 'borrow/repay',
  pipe: ({
    addressProvider,
    post,
    client,
    walletStatus,
    storage,
    signal,
  }: OperationDependency<DependencyList>) => [
    effect(fabricateRepay, takeTxFee(storage)), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    getTxInfo(client, signal), // -> { TxResult, TxInfo }
    merge(
      refetchMarket(addressProvider, client, walletStatus),
      injectTxFee(storage),
    ), // -> { TxResult, TxInfo, MarketBalanceOverview, MarketOverview, MarketUserOverview, txFee }
    pickRepayResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
