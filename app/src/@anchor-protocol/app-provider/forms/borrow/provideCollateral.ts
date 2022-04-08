import {
  BorrowBorrower,
  borrowProvideCollateralForm,
} from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { bAsset } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { u } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useWhitelistCollateralQuery, WhitelistCollateral } from 'queries';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export function useBorrowProvideCollateralForm(
  collateral: WhitelistCollateral,
  balance: u<bAsset>,
  fallbackBorrowMarket: BorrowMarketWithDisplay,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const { uUST } = useBalances();

  const { data: whitelist = [] } = useWhitelistCollateralQuery();

  const { data: { oraclePrices, bAssetLtvs } = fallbackBorrowMarket } =
    useBorrowMarketQuery();

  const {
    data: { marketBorrowerInfo, overseerCollaterals } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  return useForm(
    borrowProvideCollateralForm,
    {
      collateral,
      userBAssetBalance: balance,
      userUSTBalance: uUST,
      connected,
      oraclePrices,
      overseerCollaterals,
      marketBorrowerInfo,
      whitelist,
      fixedFee,
      bAssetLtvs,
    },
    () => ({ depositAmount: '' as bAsset }),
  );
}
