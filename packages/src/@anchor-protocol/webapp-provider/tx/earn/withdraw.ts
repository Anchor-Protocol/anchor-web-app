import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { aUST, uUST } from '@anchor-protocol/types';
import { earnWithdrawTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';
import { useOperationBroadcaster } from '@terra-dev/broadcastable-operation';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { BigSource } from 'big.js';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface EarnWithdrawTxParams {
  withdrawAmount: aUST;
  txFee: uUST<BigSource>;
  onTxSucceed?: () => void;
}

export function useEarnWithdrawTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  // TODO remove
  const { dispatch } = useOperationBroadcaster();

  const stream = useCallback(
    ({ withdrawAmount, txFee, onTxSucceed }: EarnWithdrawTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return earnWithdrawTx({
        // fabricateMarketReedeemStableCoin
        address: connectedWallet.walletAddress,
        market: MARKET_DENOMS.UUSD,
        amount: withdrawAmount,
        addressProvider,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee: txFee.toString() as uUST,
        gasFee: constants.gasFee,
        gasAdjustment: constants.gasAdjustment,
        // query
        mantleEndpoint,
        mantleFetch,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.EARN_WITHDRAW);
          dispatch('', 'done');
        },
      });
    },
    [
      connectedWallet,
      addressProvider,
      constants.gasFee,
      constants.gasAdjustment,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
      dispatch,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
