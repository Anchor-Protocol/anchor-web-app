import { COLLATERAL_DENOMS, MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { bAsset } from '@anchor-protocol/types';
import { borrowProvideCollateralTx } from '@anchor-protocol/webapp-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export interface BorrowProvideCollateralTxParams {
  depositAmount: bAsset;
  collateralDenom: COLLATERAL_DENOMS;
  onTxSucceed?: () => void;
}

export function useBorrowProvideCollateralTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, addressProvider, constants } =
    useAnchorWebapp();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({
      depositAmount,
      collateralDenom,
      onTxSucceed,
    }: BorrowProvideCollateralTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return borrowProvideCollateralTx({
        address: connectedWallet.walletAddress,
        amount: depositAmount,
        market: MARKET_DENOMS.UUSD,
        collateral: collateralDenom,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        // query
        queryClient,
        borrowMarketQuery,
        borrowBorrowerQuery,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL);
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
      queryClient,
      refetchQueries,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
