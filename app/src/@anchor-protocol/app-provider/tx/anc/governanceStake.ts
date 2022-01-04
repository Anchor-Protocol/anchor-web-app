import { ancGovernanceStakeTx } from '@anchor-protocol/app-fns';
import { ANC } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncGovernanceStakeTxParams {
  ancAmount: ANC;

  onTxSucceed?: () => void;
}

export function useAncGovernanceStakeTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ ancAmount, onTxSucceed }: AncGovernanceStakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return ancGovernanceStakeTx({
        // fabricateGovStakeVoting
        walletAddr: connectedWallet.walletAddress,
        ancAmount,
        govAddr: contractAddress.anchorToken.gov,
        ancTokenAddr: contractAddress.cw20.ANC,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_GOVERNANCE_STAKE);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.anchorToken.gov,
      contractAddress.cw20.ANC,
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
