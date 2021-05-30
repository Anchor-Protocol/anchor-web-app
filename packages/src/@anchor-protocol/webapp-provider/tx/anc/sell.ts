import { formatExecuteMsgNumber } from '@anchor-protocol/notation';
import { ANC, uUST } from '@anchor-protocol/types';
import { ancSellTx } from '@anchor-protocol/webapp-fns';
import { useAncPriceQuery } from '@anchor-protocol/webapp-provider';
import { useStream } from '@rx-stream/react';
import { useOperationBroadcaster } from '@terra-dev/broadcastable-operation';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncSellTxParams {
  burnAmount: ANC;

  onTxSucceed?: () => void;
}

export function useAncSellTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  // TODO remove
  const { dispatch } = useOperationBroadcaster();

  const stream = useCallback(
    ({ burnAmount, onTxSucceed }: AncSellTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost || !ancPrice) {
        throw new Error('Can not post!');
      }

      return ancSellTx({
        // fabricatebSell
        address: connectedWallet.walletAddress,
        amount: burnAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.ANCPoolSize).div(ancPrice.USTPoolSize),
        ),
        maxSpread: '0.1',
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_SELL);
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
