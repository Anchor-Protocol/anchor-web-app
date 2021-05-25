import { COLLATERAL_DENOMS, MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { bLuna, uUST } from '@anchor-protocol/types';
import { borrowProvideCollateralTx } from '@anchor-protocol/webapp-fns';
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

export interface BorrowProvideCollateralTxParams {
  depositAmount: bLuna;
  onTxSucceed?: () => void;
}

export function useBorrowProvideCollateralTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const refetchQueries = useRefetchQueries();

  // TODO remove
  const { dispatch } = useOperationBroadcaster();

  const stream = useCallback(
    ({ depositAmount, onTxSucceed }: BorrowProvideCollateralTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return borrowProvideCollateralTx({
        address: connectedWallet.walletAddress,
        addressProvider,
        amount: depositAmount,
        market: MARKET_DENOMS.UUSD,
        collateral: COLLATERAL_DENOMS.UBLUNA,
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
          refetchQueries(ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL);
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
