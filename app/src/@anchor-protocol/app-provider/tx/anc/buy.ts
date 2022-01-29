import { ancBuyTx } from '@anchor-protocol/app-fns';
import { u, UST } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useAnchorBank } from '../../hooks/useAnchorBank';
import { useAncPriceQuery } from '../../queries/anc/price';

export interface AncBuyTxParams {
  fromAmount: UST;
  txFee: u<UST>;
  maxSpread: number;

  onTxSucceed?: () => void;
}

export function useAncBuyTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, addressProvider, constants } =
    useAnchorWebapp();

  const { tax } = useAnchorBank();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const stream = useCallback(
    ({ fromAmount, txFee, maxSpread, onTxSucceed }: AncBuyTxParams) => {
      if (!availablePost || !connected || !connectedWallet || !ancPrice) {
        throw new Error('Can not post!');
      }

      return ancBuyTx({
        // fabricatebBuy
        address: terraWalletAddress,
        amount: fromAmount,
        denom: 'uusd',
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.USTPoolSize).div(ancPrice.ANCPoolSize),
        ),
        maxSpread: maxSpread.toString(),
        // post
        tax,
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_BUY);
        },
      });
    },
    [
      availablePost,
      connected,
      connectedWallet,
      ancPrice,
      terraWalletAddress,
      tax,
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
