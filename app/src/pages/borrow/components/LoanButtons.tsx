import { uUST } from '@anchor-protocol/types';
import { computeBorrowedAmount } from '@anchor-protocol/webapp-fns';
import {
  computeCollateralTotalUST,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/webapp-provider';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useMemo } from 'react';
import { useBorrowDialog } from './useBorrowDialog';
import { useRepayDialog } from './useRepayDialog';

export function LoanButtons() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { data: borrowMarket } = useBorrowMarketQuery();

  const { data: borrowBorrower } = useBorrowBorrowerQuery();

  const connectedWallet = useConnectedWallet();

  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();
  const [openRepayDialog, repayDialogElement] = useRepayDialog();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const collateralsInUST = useMemo(() => {
    if (!borrowBorrower || !borrowMarket) {
      return '0' as uUST;
    }
    return computeCollateralTotalUST(
      borrowBorrower.overseerCollaterals,
      borrowMarket.oraclePrices,
    );
  }, [borrowBorrower, borrowMarket]);

  const borrowed = useMemo(() => {
    return computeBorrowedAmount(borrowBorrower?.marketBorrowerInfo);
  }, [borrowBorrower?.marketBorrowerInfo]);

  return (
    <>
      <ActionButton
        disabled={
          !connectedWallet ||
          !borrowMarket ||
          !borrowBorrower ||
          big(collateralsInUST).lte(0)
        }
        onClick={() =>
          borrowMarket &&
          borrowBorrower &&
          openBorrowDialog({
            fallbackBorrowMarket: borrowMarket,
            fallbackBorrowBorrower: borrowBorrower,
          })
        }
      >
        Borrow
      </ActionButton>
      <ActionButton
        disabled={
          !connectedWallet ||
          !borrowMarket ||
          !borrowBorrower ||
          borrowed.lte(0)
        }
        onClick={() =>
          borrowMarket &&
          borrowBorrower &&
          openRepayDialog({
            fallbackBorrowMarket: borrowMarket,
            fallbackBorrowBorrower: borrowBorrower,
          })
        }
      >
        Repay
      </ActionButton>

      {borrowDialogElement}
      {repayDialogElement}
    </>
  );
}
