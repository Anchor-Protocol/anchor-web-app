import { uUST } from '@anchor-protocol/types';
import { bondWithdrawTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface BondWithdrawTxParams {
  onTxSucceed?: () => void;
}

export function useBondWithdrawTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ onTxSucceed }: BondWithdrawTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return bondWithdrawTx({
        // fabricatebAssetWithdrawUnbonded
        address: connectedWallet.walletAddress,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: constants.fixedGas.toString() as uUST,
        gasFee: constants.txGasFee.bondWithdraw,
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
          refetchQueries(ANCHOR_TX_KEY.BOND_WITHDRAW);
        },
      });
    },
    [
      connectedWallet,
      constants.fixedGas,
      constants.txGasFee.bondWithdraw,
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
