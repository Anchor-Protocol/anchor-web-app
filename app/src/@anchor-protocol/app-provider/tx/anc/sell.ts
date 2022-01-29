import { ancSellTx } from '@anchor-protocol/app-fns';
import { ANC } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useAncPriceQuery } from '../../queries/anc/price';

export interface AncSellTxParams {
  burnAmount: ANC;
  maxSpread: number;

  onTxSucceed?: () => void;
}

export function useAncSellTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, addressProvider, constants } =
    useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const stream = useCallback(
    ({ burnAmount, maxSpread, onTxSucceed }: AncSellTxParams) => {
      if (!availablePost || !connected || !connectedWallet || !ancPrice) {
        throw new Error('Can not post!');
      }

      return ancSellTx({
        // fabricatebSell
        address: terraWalletAddress,
        amount: burnAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.ANCPoolSize).div(ancPrice.USTPoolSize),
        ),
        maxSpread: maxSpread.toString(),
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
          refetchQueries(ANCHOR_TX_KEY.ANC_SELL);
        },
      });
    },
    [
      availablePost,
      connected,
      connectedWallet,
      ancPrice,
      terraWalletAddress,
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
