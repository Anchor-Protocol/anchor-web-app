import { earnWithdrawTx } from '@anchor-protocol/app-fns';
import { AnchorWithdrawParams } from 'contexts/api';
import { ANCHOR_TX_KEY } from '@anchor-protocol/app-provider';
import { TxObservableFnDependencies, TxObservableFn } from './common';

export const createWithdrawApi = (
  dependencies: TxObservableFnDependencies,
): TxObservableFn<AnchorWithdrawParams> => {
  const {
    constants,
    connectedWallet,
    contractAddress,
    queryClient,
    txErrorReporter,
    refetchQueries,
  } = dependencies;
  return (params: AnchorWithdrawParams) => {
    if (!connectedWallet || !connectedWallet.availablePost) {
      throw new Error('Can not post!');
    }
    const { withdrawAmount, txFee, onTxSucceed } = params;
    return earnWithdrawTx({
      // fabricateMarketReedeemStableCoin
      walletAddr: connectedWallet.walletAddress,
      withdrawAmount,
      marketAddr: contractAddress.moneyMarket.market,
      aUstTokenAddr: contractAddress.cw20.aUST,
      // post
      network: connectedWallet.network,
      post: connectedWallet.post,
      txFee,
      gasFee: constants.gasWanted,
      gasAdjustment: constants.gasAdjustment,
      // query
      queryClient,
      // error
      txErrorReporter,
      // side effect
      onTxSucceed: () => {
        onTxSucceed?.();
        refetchQueries(ANCHOR_TX_KEY.EARN_WITHDRAW);
      },
    });
  };
};
