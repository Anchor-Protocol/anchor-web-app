import { Airdrop, airdropClaimTx } from '@anchor-protocol/app-fns';
import { useGasPrice, useRefetchQueries } from '@libs/app-provider';
import { u, UST } from '@libs/types';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AirdropClaimTxParams {
  airdrop: Airdrop;

  onTxSucceed?: () => void;
}

export function useAirdropClaimTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useAnchorWebapp();

  const airdropFee = useGasPrice(constants.airdropGas, 'uusd');

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ airdrop, onTxSucceed }: AirdropClaimTxParams) => {
      if (
        !availablePost ||
        !connected ||
        !connectedWallet ||
        !terraWalletAddress
      ) {
        throw new Error('Can not post!');
      }

      return airdropClaimTx({
        airdrop,
        airdropContract: contractAddress.bluna.airdropRegistry,
        walletAddress: terraWalletAddress,
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
      availablePost,
      connected,
      connectedWallet,
      contractAddress.bluna.airdropRegistry,
      terraWalletAddress,
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
