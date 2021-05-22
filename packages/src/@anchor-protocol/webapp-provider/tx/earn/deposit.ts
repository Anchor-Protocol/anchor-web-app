import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { UST, uUST } from '@anchor-protocol/types';
import { earnDepositTx } from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';
import { BigSource } from 'big.js';
import { useCallback } from 'react';

export interface EarnDepositTxParams {
  depositAmount: UST;
  txFee: uUST<BigSource>;
  onTxSucceed?: () => void;
}

export function useEarnDepositTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, contants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const { refetchTokenBalances } = useBank();

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
          refetchTokenBalances();
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
      refetchTokenBalances,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
