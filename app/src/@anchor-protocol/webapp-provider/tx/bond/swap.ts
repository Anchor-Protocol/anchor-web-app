import { bLuna, Rate } from '@anchor-protocol/types';
import { bondSwapTx } from '@anchor-protocol/webapp-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface BondSwapTxParams {
  burnAmount: bLuna;
  beliefPrice: Rate;
  maxSpread: Rate;
  onTxSucceed?: () => void;
}

export function useBondSwapTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, addressProvider, constants } =
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
        amount: burnAmount,
        belief_price: beliefPrice,
        max_spread: maxSpread,
        address: connectedWallet.walletAddress,
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
          refetchQueries(ANCHOR_TX_KEY.BOND_SWAP);
        },
      });
    },
    [
      connectedWallet,
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
