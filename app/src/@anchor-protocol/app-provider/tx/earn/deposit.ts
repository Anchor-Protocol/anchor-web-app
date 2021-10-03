import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { u, UST } from '@anchor-protocol/types';
import { earnDepositTx } from '@anchor-protocol/app-fns';
import { useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface EarnDepositTxParams {
  depositAmount: UST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export function useEarnDepositTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants, txErrorReporter, queryClient } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ depositAmount, txFee, onTxSucceed }: EarnDepositTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return earnDepositTx({
        // fabricateMarketDepositStableCoin
        address: connectedWallet.walletAddress,
        market: MARKET_DENOMS.UUSD,
        amount: depositAmount,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee: txFee.toString() as u<UST>,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);
        },
      });
    },
    [
      connectedWallet,
      constants.gasWanted,
      constants.gasAdjustment,
      addressProvider,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
