import { BorrowBorrower, borrowBorrowForm } from '@anchor-protocol/app-fns';
import {
  BorrowMarketWithDisplay,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { CollateralAmount } from '@anchor-protocol/types';
import { useFixedFee, useUstTax } from '@libs/app-provider';
import { CW20Addr, UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useAnchorWebapp } from '../../contexts/context';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export function useBorrowBorrowForm(
  fallbackBorrowMarket: BorrowMarketWithDisplay,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const { target } = useDeploymentTarget();

  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { uUST } = useBalances();

  const { taxRate, maxTax } = useUstTax();

  const {
    data: {
      borrowRate,
      oraclePrices,
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
      target,
      maxTaxUUSD: maxTax,
      taxRate: taxRate,
      userUSTBalance: uUST,
      connected,
      oraclePrices,
      borrowRate,
      bAssetLtvs,
      overseerCollaterals,
      blocksPerYear,
      marketBorrowerInfo,
      overseerWhitelist,
      fixedFee,
    },
    () => ({
      borrowAmount: '' as UST,
      collateralAmount: '' as CollateralAmount,
      // hard code for testing
      collateralToken:
        'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x' as CW20Addr,
      //'0x6190e33FF30f3761Ce544ce539d69dDcD6aDF5eC' as ERC20Addr,
    }),
  );
}
