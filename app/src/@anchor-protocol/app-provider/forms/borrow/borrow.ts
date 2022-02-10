import { BorrowBorrower, borrowBorrowForm } from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { useFixedFee } from '@libs/app-provider';
import { UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useAnchorWebapp } from '../../contexts/context';
import { useAnchorBank } from '../../hooks/useAnchorBank';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export function useBorrowBorrowForm(
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
      connected: !!connectedWallet,
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
