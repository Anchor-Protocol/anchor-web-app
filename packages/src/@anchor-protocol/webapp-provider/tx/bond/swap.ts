import { bLuna, Rate, uUST } from '@anchor-protocol/types';
import { bondSwapTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
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

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

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
        fixedGas: constants.fixedGas.toString() as uUST,
        gasFee: constants.txGasFee.bondSwap,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        // query
        mantleEndpoint,
        mantleFetch,
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
      constants.fixedGas,
      constants.txGasFee.bondSwap,
      constants.gasAdjustment,
      addressProvider,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
