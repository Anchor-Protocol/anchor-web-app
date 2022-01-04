import { govVoteTx } from '@anchor-protocol/app-fns';
import { ANC } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface GovVoteTxParams {
  amount: ANC;
  voteFor: 'yes' | 'no';
  pollId: number;

  onTxSucceed?: () => void;
}

export function useGovVoteTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(
    ({ amount, voteFor, pollId, onTxSucceed }: GovVoteTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return govVoteTx({
        // fabricateGovCastVote
        walletAddr: connectedWallet.walletAddress,
        amount,
        voteFor,
        pollId,
        govAddr: contractAddress.anchorToken.gov,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.GOV_VOTE);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.anchorToken.gov,
      fixedFee,
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
