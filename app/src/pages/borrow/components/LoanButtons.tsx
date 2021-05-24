import {
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/webapp-provider';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useBorrowDialog } from 'pages/borrow/components/useBorrowDialog';
import { useRepayDialog } from 'pages/borrow/components/useRepayDialog';
import { borrowed as _borrowed } from 'pages/borrow/logics/borrowed';
import { useMemo } from 'react';

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
          big(borrowBorrower.custodyBorrower.balance ?? 0).lte(0)
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
        disabled={!connectedWallet || borrowed.lte(0)}
        onClick={() => {
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
