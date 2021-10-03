import { Airdrop, airdropClaimTx } from '@anchor-protocol/webapp-fns';
import { useGasPrice, useRefetchQueries } from '@libs/app-provider';
import { u, UST } from '@libs/types';
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

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useAnchorWebapp();

  const airdropFee = useGasPrice(constants.airdropGas, 'uusd');

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
        txFee: airdropFee as u<UST>,
        // query
        queryClient,
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
      airdropFee,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
