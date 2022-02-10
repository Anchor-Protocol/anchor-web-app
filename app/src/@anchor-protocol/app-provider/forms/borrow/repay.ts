import { BorrowBorrower, borrowRepayForm } from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { useFixedFee } from '@libs/app-provider';
import { UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useAnchorWebapp } from '../../contexts/context';
import { useAnchorBank } from '../../hooks/useAnchorBank';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export function useBorrowRepayForm(
  fallbackBorrowMarket: BorrowMarketWithDisplay,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { tokenBalances, tax } = useAnchorBank();

  const {
    data: {
      borrowRate,
      oraclePrices,
      marketState,
      bAssetLtvsAvg,
      bAssetLtvs,
      overseerWhitelist,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: {
      marketBorrowerInfo,
      overseerCollaterals,
      blockHeight,
    } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  return useForm(
    borrowRepayForm,
    {
      maxTaxUUSD: tax.maxTaxUUSD,
      taxRate: tax.taxRate,
      userUSTBalance: tokenBalances.uUST,
      connected: !!connectedWallet,
      oraclePrices,
      borrowRate,
      overseerCollaterals,
      blocksPerYear,
      marketBorrowerInfo,
      overseerWhitelist,
      fixedFee,
      blockHeight,
      marketState,
      bAssetLtvsAvg,
      bAssetLtvs,
    },
    () => ({ repayAmount: '' as UST }),
  );
}
