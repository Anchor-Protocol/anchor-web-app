import { ANC, UST, uUST } from '@anchor-protocol/types';
import { ancAncUstLpProvideTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';
import { useOperationBroadcaster } from '@terra-dev/broadcastable-operation';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useAncPriceQuery } from '../../queries/anc/price';

export interface AncAncUstLpProvideTxParams {
  ancAmount: ANC;
  ustAmount: UST;
  txFee: uUST;
  onTxSucceed?: () => void;
}

export function useAncAncUstLpProvideTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { tax } = useBank();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  // TODO remove
  const { dispatch } = useOperationBroadcaster();

  const stream = useCallback(
    ({
      ancAmount,
      ustAmount,
      txFee,
      onTxSucceed,
    }: AncAncUstLpProvideTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost || !ancPrice) {
        throw new Error('Can not post!');
      }

      return ancAncUstLpProvideTx({
        // fabricateTerraswapProvideLiquidityANC
        address: connectedWallet.walletAddress,
        token_amount: ancAmount,
        native_amount: ustAmount,
        quote: 'uusd',
        // receipts
        ancPrice,
        tax,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee: txFee.toString() as uUST,
        fixedGas: constants.fixedGas.toString() as uUST,
        gasFee: constants.gasFee,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_ANC_UST_LP_PROVIDE);
          dispatch('', 'done');
        },
      });
    },
    [
      connectedWallet,
      ancPrice,
      constants.fixedGas,
      constants.gasFee,
      constants.gasAdjustment,
      tax,
      addressProvider,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
      dispatch,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
