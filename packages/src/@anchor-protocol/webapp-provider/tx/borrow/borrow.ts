import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { UST, uUST } from '@anchor-protocol/types';
import { ANCHOR_TX_KEY, borrowBorrowTx } from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider/contexts/context';
import { useBorrowBorrowerQuery } from '@anchor-protocol/webapp-provider/queries/borrow/borrower';
import { useBorrowMarketQuery } from '@anchor-protocol/webapp-provider/queries/borrow/market';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';

export interface BorrowBorrowTxParams {
  borrowAmount: UST;
  onTxSucceed?: () => void;
}

export function useBorrowBorrowTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ borrowAmount, onTxSucceed }: BorrowBorrowTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return borrowBorrowTx({
        address: connectedWallet.walletAddress,
        addressProvider,
        amount: borrowAmount,
        market: MARKET_DENOMS.UUSD,
        borrowMarketQuery,
        borrowBorrowerQuery,
        // post
        post: connectedWallet.post,
        txFee: constants.fixedGas.toString() as uUST,
        gasFee: constants.gasFee,
        gasAdjustment: constants.gasAdjustment,
        // query
        mantleEndpoint,
        mantleFetch,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.BORROW_BORROW);
        },
      });
    },
    [
      addressProvider,
      borrowBorrowerQuery,
      borrowMarketQuery,
      connectedWallet,
      constants.fixedGas,
      constants.gasAdjustment,
      constants.gasFee,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
