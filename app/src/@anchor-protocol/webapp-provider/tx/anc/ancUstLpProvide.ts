import { ANC, u, UST } from '@anchor-protocol/types';
import { ancAncUstLpProvideTx } from '@anchor-protocol/webapp-fns';
import { useAnchorBank } from '@anchor-protocol/webapp-provider/hooks/useAnchorBank';
import { useFixedFee } from '@libs/app-provider';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useAncPriceQuery } from '../../queries/anc/price';

export interface AncAncUstLpProvideTxParams {
  ancAmount: ANC;
  ustAmount: UST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export function useAncAncUstLpProvideTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { tax } = useAnchorBank();

  const fixedFee = useFixedFee();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

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
        slippage_tolerance: '0.01',
        quote: 'uusd',
        // receipts
        ancPrice,
        tax,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee: txFee.toString() as u<UST>,
        fixedGas: fixedFee,
        gasFee: constants.gasWanted,
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
        },
      });
    },
    [
      connectedWallet,
      ancPrice,
      tax,
      fixedFee,
      constants.gasWanted,
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
