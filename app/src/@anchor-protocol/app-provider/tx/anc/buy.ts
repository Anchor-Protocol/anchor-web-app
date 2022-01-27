import { ancBuyTx } from '@anchor-protocol/app-fns';
import { Rate, u, UST } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useAnchorBank } from '../../hooks/useAnchorBank';
import { useAncPriceQuery } from '../../queries/anc/price';

export interface AncBuyTxParams {
  fromAmount: UST;
  maxSpread: number;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useAncBuyTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const { tax } = useAnchorBank();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const stream = useCallback(
    ({ fromAmount, txFee, maxSpread, onTxSucceed }: AncBuyTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost || !ancPrice) {
        throw new Error('Can not post!');
      }

      return ancBuyTx({
        // fabricatebBuy
        walletAddr: connectedWallet.walletAddress,
        fromAmount,
        ancUstPairAddr: contractAddress.terraswap.ancUstPair,
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.USTPoolSize).div(ancPrice.ANCPoolSize),
        ) as UST,
        maxSpread: maxSpread.toString() as Rate,
        // post
        tax,
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
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
          refetchQueries(ANCHOR_TX_KEY.ANC_BUY);
        },
      });
    },
    [
      connectedWallet,
      ancPrice,
      contractAddress.terraswap.ancUstPair,
      tax,
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
