import {
  BorrowBorrower,
  borrowRedeemCollateralForm,
} from '@anchor-protocol/app-fns';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { useBorrowBorrowerQuery } from '@anchor-protocol/app-provider/queries/borrow/borrower';
import {
  BorrowMarketWithDisplay,
  useBorrowMarketQuery,
} from '@anchor-protocol/app-provider/queries/borrow/market';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance, useFixedFee } from '@libs/app-provider';
import { CW20Addr } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';

export function useBorrowRedeemCollateralForm(
  collateralToken: CW20Addr,
  fallbackBorrowMarket: BorrowMarketWithDisplay,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const { tokenBalances } = useAnchorBank();

  const ubAssetBalance = useCW20Balance<bAsset>(
    collateralToken,
    connectedWallet?.walletAddress,
  );

  const {
    data: {
      oraclePrices,
      bAssetLtvs,
      bAssetLtvsAvg,
      overseerWhitelist,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: { marketBorrowerInfo, overseerCollaterals } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  return useForm(
    borrowRedeemCollateralForm,
    {
      collateralToken,
      userBAssetBalance: ubAssetBalance,
      userUSTBalance: tokenBalances.uUST,
      connected: !!connectedWallet,
      oraclePrices,
      overseerCollaterals,
      marketBorrowerInfo,
      overseerWhitelist,
      fixedFee,
      bAssetLtvsAvg,
      bAssetLtvs,
    },
    () => ({ redeemAmount: '' as bAsset }),
  );
}
