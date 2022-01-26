import { borrowProvideCollateralTx } from '@anchor-protocol/app-fns';
import { bAsset, CW20Addr } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useBAssetInfoByTokenAddrQuery } from '../../queries/basset/bAssetInfoByTokenAddr';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export interface BorrowProvideCollateralTxParams {
  depositAmount: bAsset;
  //collateralDenom: COLLATERAL_DENOMS;
  onTxSucceed?: () => void;
}

export function useBorrowProvideCollateralTx(bAssetTokenAddr: CW20Addr) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const { data: { bAsset } = {} } =
    useBAssetInfoByTokenAddrQuery(bAssetTokenAddr);

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ depositAmount, onTxSucceed }: BorrowProvideCollateralTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost || !bAsset) {
        throw new Error('Can not post!');
      }

      return borrowProvideCollateralTx({
        walletAddr: connectedWallet.walletAddress,
        depositAmount,
        bAssetTokenAddr,
        overseerAddr: contractAddress.moneyMarket.overseer,
        bAssetCustodyAddr: bAsset.custody_contract,
        bAssetSymbol: bAsset.symbol,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
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
          refetchQueries(ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL);
        },
      });
    },
    [
      bAsset,
      bAssetTokenAddr,
      borrowBorrowerQuery,
      borrowMarketQuery,
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.moneyMarket.overseer,
      fixedFee,
      queryClient,
      refetchQueries,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
