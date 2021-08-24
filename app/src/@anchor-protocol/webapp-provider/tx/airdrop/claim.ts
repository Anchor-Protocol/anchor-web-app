import { Airdrop, airdropClaimTx } from '@anchor-protocol/webapp-fns';
import { u, UST } from '@libs/types';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
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
        gasFee: constants.airdropGasWanted,
        txFee: constants.airdropGas.toFixed() as u<UST>,
        // query
        mantleEndpoint,
        mantleFetch,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.AIRDROP_CLAIM);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.bluna.airdropRegistry,
      constants.gasAdjustment,
      constants.airdropGasWanted,
      constants.airdropGas,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
