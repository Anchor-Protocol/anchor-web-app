import { ANC } from '@anchor-protocol/types';
import { govVoteTx } from '@anchor-protocol/app-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface GovVoteTxParams {
  amount: ANC;
  voteFor: 'yes' | 'no';
  pollId: number;

  onTxSucceed?: () => void;
}

export function useGovVoteTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, addressProvider, constants } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(
    ({ amount, voteFor, pollId, onTxSucceed }: GovVoteTxParams) => {
      if (!availablePost || !connected || !connectedWallet) {
        throw new Error('Can not post!');
      }

      return govVoteTx({
        // fabricateGovCastVote
        address: terraWalletAddress,
        amount,
        vote: voteFor,
        poll_id: pollId,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
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
          refetchQueries(ANCHOR_TX_KEY.GOV_VOTE);
        },
      });
    },
    [
      availablePost,
      connected,
      connectedWallet,
      terraWalletAddress,
      fixedFee,
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
