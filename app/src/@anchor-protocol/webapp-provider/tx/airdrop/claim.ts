import { Airdrop, airdropClaimTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AirdropClaimTxParams {
  airdrop: Airdrop;

  onTxSucceed?: () => void;
}

export function useAirdropClaimTx() {
  const connectedWallet = useConnectedWallet();

  const { constants, contractAddress } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ airdrop, onTxSucceed }: AirdropClaimTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return airdropClaimTx({
        airdrop,
        airdropContract: contractAddress.bluna.airdropRegistry,
        walletAddress: connectedWallet.walletAddress,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        gasAdjustment: constants.gasAdjustment,
        // query
        mantleEndpoint,
        mantleFetch,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          setTimeout(() => {
            refetchQueries(ANCHOR_TX_KEY.AIRDROP_CLAIM);
          }, 2000);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.bluna.airdropRegistry,
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
