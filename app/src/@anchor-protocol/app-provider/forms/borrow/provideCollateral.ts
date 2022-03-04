import {
  BorrowBorrower,
  borrowProvideCollateralForm,
  BorrowProvideCollateralFormStates,
} from '@anchor-protocol/app-fns';
import { BorrowMarketWithDisplay } from '@anchor-protocol/app-provider';
import { bAsset } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { CW20Addr, u } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useCallback } from 'react';
import { useBorrowBorrowerQuery } from '../../queries/borrow/borrower';
import { useBorrowMarketQuery } from '../../queries/borrow/market';

export interface BorrowProvideCollateralFormReturn
  extends BorrowProvideCollateralFormStates {
  updateDepositAmount: (depositAmount: bAsset) => void;
}

export function useBorrowProvideCollateralForm(
  collateralToken: CW20Addr,
  balance: u<bAsset>,
  fallbackBorrowMarket: BorrowMarketWithDisplay,
  fallbackBorrowBorrower: BorrowBorrower,
) {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const { uUST } = useBalances();

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

  const [input, states] = useForm(
    borrowProvideCollateralForm,
    {
      collateralToken,
      userBAssetBalance: balance,
      userUSTBalance: uUST,
      connected,
      oraclePrices,
      overseerCollaterals,
      marketBorrowerInfo,
      overseerWhitelist,
      fixedFee,
      bAssetLtvs,
    },
    () => ({ depositAmount: '' as bAsset }),
  );

  const updateDepositAmount = useCallback(
    (depositAmount: bAsset) => {
      input({
        depositAmount,
      });
    },
    [input],
  );

  return {
    ...states,
    updateDepositAmount,
  };
}
