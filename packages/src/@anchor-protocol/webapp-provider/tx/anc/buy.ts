import { formatExecuteMsgNumber } from '@anchor-protocol/notation';
import { UST, uUST } from '@anchor-protocol/types';
import { ancBuyTx } from '@anchor-protocol/webapp-fns';
import { useAncPriceQuery } from '@anchor-protocol/webapp-provider';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncBuyTxParams {
  fromAmount: UST;
  txFee: uUST;

  onTxSucceed?: () => void;
}

export function useAncBuyTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { tax } = useBank();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const stream = useCallback(
    ({ fromAmount, txFee, onTxSucceed }: AncBuyTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost || !ancPrice) {
        throw new Error('Can not post!');
      }

      return ancBuyTx({
        // fabricatebBuy
        address: connectedWallet.walletAddress,
        amount: fromAmount,
        denom: 'uusd',
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.USTPoolSize).div(ancPrice.ANCPoolSize),
        ),
        maxSpread: '0.1',
        // post
        tax,
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_BUY);
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
      tax,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
