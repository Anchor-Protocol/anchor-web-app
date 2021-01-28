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
  const {
    marketBalance,
    marketOverview,
    marketUserOverview,
    refetch,
  } = useMarket();

  const { status } = useWallet();

  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();
  const [openRepayDialog, repayDialogElement] = useRepayDialog();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const borrowed = useBorrowed(
    marketUserOverview?.loanAmount.loan_amount,
    marketOverview?.borrowRate.rate,
    marketBalance?.currentBlock,
    marketBalance?.marketState.last_interest_updated,
    marketBalance?.marketState.global_interest_index,
    marketUserOverview?.liability.interest_index,
  );

  return (
    <>
      <ActionButton
        disabled={
          status.status !== 'ready' ||
          !marketOverview ||
          !marketUserOverview ||
          big(marketUserOverview?.borrowInfo.balance ?? 0).lte(0)
        }
        onClick={() => {
          refetch();
          openBorrowDialog({});
        }}
      >
        Borrow
      </ActionButton>
      <ActionButton
        disabled={
          status.status !== 'ready' ||
          !marketBalance ||
          !marketOverview ||
          !marketUserOverview ||
          borrowed.lte(0)
        }
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
