import {
  computeBorrowedAmount,
  computeCollateralsTotalUST,
} from '@anchor-protocol/app-fns';
import {
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { u, UST } from '@anchor-protocol/types';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import big from 'big.js';
import React, { useMemo } from 'react';
import { useAccount } from 'contexts/account';
import { useBorrowDialog } from './useBorrowDialog';
import { useRepayDialog } from './useRepayDialog';

export function LoanButtons() {
  const {
    target: { isNative },
  } = useDeploymentTarget();

  const { data: borrowMarket } = useBorrowMarketQuery();

  const { data: borrowBorrower } = useBorrowBorrowerQuery();

  const { connected } = useAccount();

  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();

  const [openRepayDialog, repayDialogElement] = useRepayDialog();

  const collateralsValue = useMemo(() => {
    if (!borrowBorrower || !borrowMarket) {
      return '0' as u<UST>;
    }
    return computeCollateralsTotalUST(
      borrowBorrower.overseerCollaterals,
      borrowMarket.oraclePrices,
    );
  }, [borrowBorrower, borrowMarket]);

  const borrowed = useMemo(() => {
    return computeBorrowedAmount(borrowBorrower?.marketBorrowerInfo);
  }, [borrowBorrower?.marketBorrowerInfo]);

  const enableBorrowing = isNative
    ? Boolean(
        connected &&
          borrowMarket &&
          borrowBorrower &&
          big(collateralsValue).gt(0),
      )
    : Boolean(connected && borrowMarket);

  return (
    <>
      <ActionButton
        disabled={enableBorrowing !== true}
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
          !connected || !borrowMarket || !borrowBorrower || borrowed.lte(0)
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
