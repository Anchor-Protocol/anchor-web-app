import { borrowRepayTx } from '@anchor-protocol/app-fns';
import { u, UST } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export interface BorrowRepayTxParams {
  repayAmount: UST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export function useBorrowRepayTx() {
  const { availablePost, connected } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ repayAmount, onTxSucceed, txFee }: BorrowRepayTxParams) => {
      if (!availablePost || !connected || !connectedWallet) {
        throw new Error('Can not post!');
      }

      return borrowRepayTx({
        walletAddr: connectedWallet.walletAddress,
        repayAmount,
        marketAddr: contractAddress.moneyMarket.market,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        borrowMarketQuery,
        borrowBorrowerQuery,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.BORROW_REPAY);
        },
      });
    },
    [
      borrowBorrowerQuery,
      borrowMarketQuery,
      connected,
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.moneyMarket.market,
      queryClient,
      refetchQueries,
      txErrorReporter,
      availablePost
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
