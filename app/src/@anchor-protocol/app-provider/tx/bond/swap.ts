import { bondSwapTx } from '@anchor-protocol/app-fns';
import { bLuna, Rate } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface BondSwapTxParams {
  burnAmount: bLuna;
  beliefPrice: Rate;
  maxSpread: number;
  onTxSucceed?: () => void;
}

export function useBondSwapTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  // TODO remove

  const stream = useCallback(
    ({ burnAmount, beliefPrice, maxSpread, onTxSucceed }: BondSwapTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return bondSwapTx({
        // fabricateTerraswapSwapbLuna
        burnAmount,
        beliefPrice,
        maxSpread: maxSpread.toString() as Rate,
        walletAddr: connectedWallet.walletAddress,
        bAssetTokenAddr: contractAddress.cw20.bLuna,
        bAssetPairAddr: contractAddress.terraswap.blunaLunaPair,
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
          refetchQueries(ANCHOR_TX_KEY.BOND_SWAP);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.cw20.bLuna,
      contractAddress.terraswap.blunaLunaPair,
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
