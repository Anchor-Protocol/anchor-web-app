import {
  BorrowBorrower,
  borrowBorrowForm,
  BorrowMarket,
} from '@anchor-protocol/app-fns';
import { useFixedFee } from '@libs/app-provider';
import { UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { useAnchorBank } from '../../hooks/useAnchorBank';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export function useBorrowBorrowForm(
  fallbackBorrowMarket: BorrowMarket,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { tokenBalances, tax } = useAnchorBank();

  const {
    data: {
      borrowRate,
      oraclePrices,
      bAssetLtvsAvg,
      bAssetLtvs,
      overseerWhitelist,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: { marketBorrowerInfo, overseerCollaterals } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  return useForm(
    borrowBorrowForm,
    {
      maxTaxUUSD: tax.maxTaxUUSD,
      taxRate: tax.taxRate,
      userUSTBalance: tokenBalances.uUST,
      connected,
      oraclePrices,
      borrowRate,
      bAssetLtvsAvg,
      bAssetLtvs,
      overseerCollaterals,
      blocksPerYear,
      marketBorrowerInfo,
      overseerWhitelist,
      fixedFee,
    },
    () => ({ borrowAmount: '' as UST }),
  );
}
