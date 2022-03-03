import {
  BorrowBorrower,
  borrowRedeemCollateralForm,
} from '@anchor-protocol/app-fns';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { useBorrowBorrowerQuery } from '@anchor-protocol/app-provider/queries/borrow/borrower';
import { useBorrowMarketQuery } from '@anchor-protocol/app-provider/queries/borrow/market';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance, useFixedFee } from '@libs/app-provider';
import { CW20Addr } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';

export function useBorrowRedeemCollateralForm(
  collateralToken: CW20Addr,
  fallbackBorrowMarket: BorrowMarketWithDisplay,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const { connected, terraWalletAddress } = useAccount();

  const fixedFee = useFixedFee();

  const { tokenBalances } = useAnchorBank();

  const ubAssetBalance = useCW20Balance<bAsset>(
    collateralToken,
    terraWalletAddress,
  );

  const {
    data: {
      oraclePrices,
      bAssetLtvs,
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
      connected,
      oraclePrices,
      overseerCollaterals,
      marketBorrowerInfo,
      overseerWhitelist,
      fixedFee,
      bAssetLtvs,
    },
    () => ({ redeemAmount: '' as bAsset }),
  );
}
