import { ancAncUstLpStakeTx } from '@anchor-protocol/app-fns';
import { AncUstLP } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncAncUstLpStakeTxParams {
  lpAmount: AncUstLP;
  onTxSucceed?: () => void;
}

export function useAncAncUstLpStakeTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ lpAmount, onTxSucceed }: AncAncUstLpStakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return ancAncUstLpStakeTx({
        // fabricateStakingBond
        lpAmount: lpAmount,
        walletAddr: connectedWallet.walletAddress,
        ancUstLpTokenAddr: contractAddress.cw20.AncUstLP,
        generatorAddr: contractAddress.astroport.generator,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.astroportGasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.ANC_ANC_UST_LP_STAKE);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.cw20.AncUstLP,
      contractAddress.astroport.generator,
      fixedFee,
      constants.astroportGasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
