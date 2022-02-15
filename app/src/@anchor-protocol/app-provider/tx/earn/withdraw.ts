import { earnWithdrawTx } from '@anchor-protocol/app-fns';
import { aUST, u, UST } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface EarnWithdrawTxParams {
  withdrawAmount: aUST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export function useEarnWithdrawTx() {
  const connectedWallet = useConnectedWallet();

  const { constants, queryClient, txErrorReporter, contractAddress } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ withdrawAmount, txFee, onTxSucceed }: EarnWithdrawTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

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
    },
    [
      connectedWallet,
      contractAddress.moneyMarket.market,
      contractAddress.cw20.aUST,
      constants.gasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
