import { borrowRedeemCollateralTx } from '@anchor-protocol/app-fns';
import { bAsset, CW20Addr } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';
import { useWhitelistCollateralByTokenAddrQuery } from '@anchor-protocol/app-provider';
import { CW20TokenDisplayInfo } from '@libs/app-fns';

export interface BorrowRedeemCollateralTxParams {
  redeemAmount: bAsset;
  tokenDisplay?: CW20TokenDisplayInfo;
  onTxSucceed?: () => void;
}

export function useBorrowRedeemCollateralTx(bAssetTokenAddr: CW20Addr) {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const { data: collateral } =
    useWhitelistCollateralByTokenAddrQuery(bAssetTokenAddr);

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({
      redeemAmount,
      onTxSucceed,
      tokenDisplay,
    }: BorrowRedeemCollateralTxParams) => {
      if (
        !connectedWallet ||
        !connected ||
        !availablePost ||
        !terraWalletAddress ||
        !collateral
      ) {
        throw new Error('Can not post!');
      }

      return borrowRedeemCollateralTx({
        tokenDisplay,
        walletAddr: terraWalletAddress,
        redeemAmount,
        bAssetTokenAddr,
        overseerAddr: contractAddress.moneyMarket.overseer,
        bAssetCustodyAddr: collateral.custody_contract,
        bAssetSymbol: collateral.symbol,
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
          refetchQueries(ANCHOR_TX_KEY.BORROW_REDEEM_COLLATERAL);
        },
      });
    },
    [
      collateral,
      bAssetTokenAddr,
      borrowBorrowerQuery,
      borrowMarketQuery,
      availablePost,
      connected,
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.moneyMarket.overseer,
      fixedFee,
      queryClient,
      refetchQueries,
      terraWalletAddress,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
