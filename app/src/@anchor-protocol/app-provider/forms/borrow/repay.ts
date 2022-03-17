import { BorrowBorrower, borrowRepayForm } from '@anchor-protocol/app-fns';
import {
  BorrowMarketWithDisplay,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { useFixedFee, useUstTax } from '@libs/app-provider';
import { UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useAnchorWebapp } from '../../contexts/context';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export function useBorrowRepayForm(
  fallbackBorrowMarket: BorrowMarketWithDisplay,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const { target } = useDeploymentTarget();

  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { taxRate, maxTax } = useUstTax();

  const { uUST } = useBalances();

  const {
    data: {
      borrowRate,
      oraclePrices,
      marketState,
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
      target,
      maxTaxUUSD: maxTax,
      taxRate: taxRate,
      userUSTBalance: uUST,
      connected,
      oraclePrices,
      borrowRate,
      overseerCollaterals,
      blocksPerYear,
      marketBorrowerInfo,
      overseerWhitelist,
      fixedFee,
      blockHeight,
      marketState,
      bAssetLtvs,
    },
    () => ({ repayAmount: '' as UST }),
  );
}
