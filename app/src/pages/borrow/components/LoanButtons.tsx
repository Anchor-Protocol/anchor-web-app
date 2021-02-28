import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import big from 'big.js';
import { useService } from 'contexts/service';
import { useBorrowDialog } from 'pages/borrow/components/useBorrowDialog';
import { useRepayDialog } from 'pages/borrow/components/useRepayDialog';
import { useMarket } from 'pages/borrow/context/market';
import { borrowed as _borrowed } from 'pages/borrow/logics/borrowed';
import { useMemo } from 'react';

export function LoanButtons() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { ready, loanAmount, borrowInfo, refetch } = useMarket();

  const { serviceAvailable } = useService();

  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();
  const [openRepayDialog, repayDialogElement] = useRepayDialog();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const borrowed = useMemo(() => _borrowed(loanAmount), [loanAmount]);

  return (
    <>
      <ActionButton
        disabled={
          !serviceAvailable ||
          !ready ||
          !borrowInfo ||
          big(borrowInfo.balance ?? 0).lte(0)
        }
        onClick={() => {
          refetch();
          openBorrowDialog({});
        }}
      >
        Borrow
      </ActionButton>
      <ActionButton
        disabled={!serviceAvailable || !ready || borrowed.lte(0)}
        onClick={() => {
          refetch();
          openRepayDialog({});
        }}
      >
        Repay
      </ActionButton>

      {borrowDialogElement}
      {repayDialogElement}
    </>
  );
}
