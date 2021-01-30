import { fabricateProvideCollateral } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  OperationDependency,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { WalletStatus } from '@anchor-protocol/wallet-provider';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickProvideCollateralResult } from 'pages/borrow/transactions/pickProvideCollateralResult';
import { refetchMarket } from 'pages/borrow/transactions/refetchMarket';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { injectTxFee, takeTxFee } from 'transactions/takeTxFee';
import { parseTxResult } from 'transactions/tx';

interface DependencyList {
  walletStatus: WalletStatus;
}

export const provideCollateralOptions = createOperationOptions({
  id: 'borrow/provide-collateral',
  pipe: ({
    addressProvider,
    post,
    client,
    walletStatus,
    signal,
    storage,
  }: OperationDependency<DependencyList>) => [
    takeTxFee(storage, fabricateProvideCollateral), // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    getTxInfo(client, signal), // TxResult -> { TxResult, TxInfo }
    injectTxFee(storage, refetchMarket(addressProvider, client, walletStatus)), // { TxResult, TxInfo } -> { TxResult, TxInfo, MarketBalanceOverview, MarketOverview, MarketUserOverview }
    pickProvideCollateralResult, // { TxResult, TxInfo, MarketBalanceOverview, MarketOverview, MarketUserOverview } -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
