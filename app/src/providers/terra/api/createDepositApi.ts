import { earnDepositTx } from '@anchor-protocol/app-fns';
import { ANCHOR_TX_KEY } from '@anchor-protocol/app-provider';
import { AnchorDepositParams } from 'contexts/api';
import { TxObservableFnDependencies, TxObservableFn } from './common';

export const createDepositApi = (
  dependencies: TxObservableFnDependencies,
): TxObservableFn<AnchorDepositParams> => {
  const {
    constants,
    connectedWallet,
    contractAddress,
    queryClient,
    txErrorReporter,
    refetchQueries,
  } = dependencies;
  return (params: AnchorDepositParams) => {
    if (!connectedWallet || connectedWallet.availablePost === false) {
      throw new Error('Can not post!');
    }
    const { depositAmount, txFee, onTxSucceed } = params;
    return earnDepositTx({
      walletAddr: connectedWallet.walletAddress,
      marketAddr: contractAddress.moneyMarket.market,
      depositAmount,
      network: connectedWallet.network,
      post: connectedWallet.post,
      txFee,
      gasFee: constants.gasWanted,
      gasAdjustment: constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      onTxSucceed: () => {
        onTxSucceed?.();
        refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);
      },
    });
  };
};
