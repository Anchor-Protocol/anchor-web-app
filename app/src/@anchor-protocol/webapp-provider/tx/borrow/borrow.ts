import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { u, UST } from '@anchor-protocol/types';
import { borrowBorrowTx } from '@anchor-protocol/webapp-fns';
import { useFixedFee } from '@libs/app-provider';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export interface BorrowBorrowTxParams {
  borrowAmount: UST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export function useBorrowBorrowTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(
    ({ borrowAmount, onTxSucceed, txFee }: BorrowBorrowTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return borrowBorrowTx({
        address: connectedWallet.walletAddress,
        market: MARKET_DENOMS.UUSD,
        amount: borrowAmount,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        fixedGas: fixedFee,
        // query
        mantleEndpoint,
        mantleFetch,
        borrowMarketQuery,
        borrowBorrowerQuery,
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
      constants.gasAdjustment,
      constants.gasWanted,
      fixedFee,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
