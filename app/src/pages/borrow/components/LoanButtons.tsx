import {
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/webapp-provider';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useMemo } from 'react';
import { borrowed as _borrowed } from '../logics/borrowed';
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
  const borrowed = useMemo(
    () => _borrowed(borrowBorrower?.marketBorrowerInfo),
    [borrowBorrower?.marketBorrowerInfo],
  );

  return (
    <>
      <ActionButton
        disabled={
          !connectedWallet ||
          !borrowMarket ||
          !borrowBorrower ||
          big(borrowBorrower.bLunaCustodyBorrower.balance ?? 0).lte(0)
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
