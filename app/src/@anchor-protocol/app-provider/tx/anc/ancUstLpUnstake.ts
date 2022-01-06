import { ancAncUstLpUnstakeTx } from '@anchor-protocol/app-fns';
import { AncUstLP } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncAncUstLpUnstakeTxParams {
  lpAmount: AncUstLP;
  onTxSucceed?: () => void;
}

export function useAncAncUstLpUnstakeTx() {
  const connectedWallet = useConnectedWallet();

  const {
    queryClient,
    txErrorReporter,
    addressProvider,
    contractAddress,
    constants,
  } = useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ lpAmount, onTxSucceed }: AncAncUstLpUnstakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return ancAncUstLpUnstakeTx({
        // fabricateStakingUnbond
        walletAddr: connectedWallet.walletAddress,
        ancUstLpTokenAddr: contractAddress.cw20.AncUstLP,
        generatorAddr: contractAddress.astroport.generator,
        amount: lpAmount,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_ANC_UST_LP_UNSTAKE);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.cw20.AncUstLP,
      contractAddress.astroport.generator,
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
