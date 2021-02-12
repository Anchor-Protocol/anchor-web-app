import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { useWallet } from '@anchor-protocol/wallet-provider';
import big from 'big.js';
import { useBorrowDialog } from 'pages/borrow/components/useBorrowDialog';
import { useRepayDialog } from 'pages/borrow/components/useRepayDialog';
import { useMarket } from 'pages/borrow/context/market';
import { useBorrowed } from 'pages/borrow/logics/useBorrowed';

export function LoanButtons() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { ready, loanAmount, borrowInfo, refetch } = useMarket();

  const { status } = useWallet();

  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();
  const [openRepayDialog, repayDialogElement] = useRepayDialog();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const borrowed = useBorrowed(loanAmount?.loan_amount);

  return (
    <>
      <ActionButton
        disabled={
          status.status !== 'ready' ||
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
        disabled={status.status !== 'ready' || !ready || borrowed.lte(0)}
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
