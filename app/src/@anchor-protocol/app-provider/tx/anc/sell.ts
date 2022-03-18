import { ancSellTx } from '@anchor-protocol/app-fns';
import { useAnchorBank } from '@anchor-protocol/app-provider';
import { ANC, Rate, UST } from '@anchor-protocol/types';
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

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const bank = useAnchorBank();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const stream = useCallback(
    ({ burnAmount, maxSpread, onTxSucceed }: AncSellTxParams) => {
      if (
        !availablePost ||
        !connected ||
        !connectedWallet ||
        !terraWalletAddress ||
        !ancPrice
      ) {
        throw new Error('Can not post!');
      }

      return ancSellTx({
        // fabricatebSell
        walletAddr: terraWalletAddress,
        burnAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.ANCPoolSize).div(ancPrice.USTPoolSize),
        ) as UST,
        maxSpread: maxSpread.toString() as Rate,
        ancTokenAddr: contractAddress.cw20.ANC,
        ancUstPairAddr: contractAddress.terraswap.ancUstPair,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        tax: bank.tax,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
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
      contractAddress.cw20.ANC,
      contractAddress.terraswap.ancUstPair,
      terraWalletAddress,
      fixedFee,
      bank.tax,
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
