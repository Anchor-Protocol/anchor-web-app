import {
  BorrowBorrower,
  borrowProvideCollateralForm,
} from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance, useFixedFee } from '@libs/app-provider';
import { CW20Addr } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useAnchorBank } from '../../hooks/useAnchorBank';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import {
  useBorrowMarketQuery,
} from '../../queries/borrow/market';

export function useBorrowProvideCollateralForm(
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
      bAssetLtvsAvg,
      overseerWhitelist,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: { marketBorrowerInfo, overseerCollaterals } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  return useForm(
    borrowProvideCollateralForm,
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
      bAssetLtvsAvg,
      bAssetLtvs,
    },
    () => ({ depositAmount: '' as bAsset }),
  );
}
