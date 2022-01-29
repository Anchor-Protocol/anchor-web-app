import { ancAncUstLpUnstakeTx } from '@anchor-protocol/app-fns';
import { AncUstLP } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncAncUstLpUnstakeTxParams {
  lpAmount: AncUstLP;
  onTxSucceed?: () => void;
}

export function useAncAncUstLpUnstakeTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

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
      if (!availablePost || !connected || !connectedWallet) {
        throw new Error('Can not post!');
      }

      return ancAncUstLpUnstakeTx({
        // fabricateStakingUnbond
        walletAddr: terraWalletAddress,
        ancUstLpTokenAddr: contractAddress.cw20.AncUstLP,
        generatorAddr: contractAddress.astroport.generator,
        amount: lpAmount,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.astroportGasWanted,
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
      availablePost,
      connected,
      connectedWallet,
      terraWalletAddress,
      contractAddress.cw20.AncUstLP,
      contractAddress.astroport.generator,
      fixedFee,
      constants.astroportGasWanted,
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
