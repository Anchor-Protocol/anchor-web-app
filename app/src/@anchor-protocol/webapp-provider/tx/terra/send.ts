import { CW20Addr, HumanAddr, Token, uUST } from '@anchor-protocol/types';
import { terraSendTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface TerraSendTxParams {
  toWalletAddress: HumanAddr;
  currency: { cw20Contract: CW20Addr } | { tokenDenom: string };
  memo?: string;
  amount: Token;
  txFee: uUST;

  onTxSucceed?: () => void;
}

export function useTerraSendTx() {
  const connectedWallet = useConnectedWallet();

  const { constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({
      toWalletAddress,
      currency,
      memo,
      amount,
      txFee,
      onTxSucceed,
    }: TerraSendTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return terraSendTx({
        myWalletAddress: connectedWallet.walletAddress,
        toWalletAddress,
        amount,
        currency,
        memo,
        txFee,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
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
          refetchQueries(ANCHOR_TX_KEY.TERRA_SEND);
        },
      });
    },
    [
      connectedWallet,
      constants.gasFee,
      constants.gasAdjustment,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
