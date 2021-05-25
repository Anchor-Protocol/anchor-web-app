import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { UST, uUST } from '@anchor-protocol/types';
import { borrowRepayTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';
import { useOperationBroadcaster } from '@terra-dev/broadcastable-operation';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export interface BorrowRepayTxParams {
  repayAmount: UST;
  onTxSucceed?: () => void;
}

export function useBorrowRepayTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const refetchQueries = useRefetchQueries();

  // TODO remove
  const { dispatch } = useOperationBroadcaster();

  const stream = useCallback(
    ({ repayAmount, onTxSucceed }: BorrowRepayTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return borrowRepayTx({
        address: connectedWallet.walletAddress,
        addressProvider,
        amount: repayAmount,
        market: MARKET_DENOMS.UUSD,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee: constants.fixedGas.toString() as uUST,
        gasFee: constants.gasFee,
        gasAdjustment: constants.gasAdjustment,
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
          refetchQueries(ANCHOR_TX_KEY.BORROW_REPAY);
          dispatch('', 'done');
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
      dispatch,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
