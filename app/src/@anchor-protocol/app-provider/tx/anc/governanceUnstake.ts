import { ANC } from '@anchor-protocol/types';
import { ancGovernanceUnstakeTx } from '@anchor-protocol/app-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncGovernanceUnstakeTxParams {
  ancAmount: ANC;

  onTxSucceed?: () => void;
}

export function useAncGovernanceUnstakeTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, addressProvider, constants } =
    useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ ancAmount, onTxSucceed }: AncGovernanceUnstakeTxParams) => {
      if (!availablePost || !connected || !connectedWallet) {
        throw new Error('Can not post!');
      }

      return ancGovernanceUnstakeTx({
        // fabricateGovStakeVoting
        address: terraWalletAddress,
        amount: ancAmount,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_GOVERNANCE_UNSTAKE);
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
