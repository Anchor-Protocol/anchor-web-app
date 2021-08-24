import { ANC, u, UST } from '@anchor-protocol/types';
import { ancSellTx } from '@anchor-protocol/webapp-fns';
import { useAncPriceQuery } from '@anchor-protocol/webapp-provider';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
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
        fixedGas: constants.fixedGas.toString() as u<UST>,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_SELL);
        },
      });
    },
    [
      connectedWallet,
      ancPrice,
      constants.fixedGas,
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
