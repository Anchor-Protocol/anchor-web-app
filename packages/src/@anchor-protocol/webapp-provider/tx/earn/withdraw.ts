import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { aUST, uUST } from '@anchor-protocol/types';
import { ANCHOR_TX_KEY, earnWithdrawTx } from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { BigSource } from 'big.js';
import { useCallback } from 'react';

export interface EarnWithdrawTxParams {
  withdrawAmount: aUST;
  txFee: uUST<BigSource>;
  onTxSucceed?: () => void;
}

export function useEarnWithdrawTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, contants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

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
        post: connectedWallet.post,
        txFee: txFee.toString() as uUST,
        gasFee: contants.gasFee,
        gasAdjustment: contants.gasAdjustment,
        // query
        mantleEndpoint,
        mantleFetch,
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
      addressProvider,
      contants.gasFee,
      contants.gasAdjustment,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
