import { ancAncUstLpWithdrawTx } from '@anchor-protocol/app-fns';
import { AncUstLP } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncAncUstLpWithdrawTxParams {
  lpAmount: AncUstLP;
  onTxSucceed?: () => void;
}

export function useAncAncUstLpWithdrawTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ lpAmount, onTxSucceed }: AncAncUstLpWithdrawTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return ancAncUstLpWithdrawTx({
        // fabricateTerraswapWithdrawLiquidityANC
        walletAddr: connectedWallet.walletAddress,
        lpAmount,
        ancUstPairAddr: contractAddress.terraswap.ancUstPair,
        ancUstLpTokenAddr: contractAddress.cw20.AncUstLP,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_ANC_UST_LP_WITHDRAW);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.terraswap.ancUstPair,
      contractAddress.cw20.AncUstLP,
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
