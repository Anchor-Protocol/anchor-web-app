import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  MICRO,
  separateBasedOnDecimalPoints,
  toFixedNoRounding,
} from '@anchor-protocol/notation';
import big from 'big.js';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useTotalDeposit } from '../queries/totalDeposit';
import { useDepositDialog } from './useDepositDialog';
import { useWithdrawDialog } from './useWithdrawDialog';

export interface TotalDepositSectionProps {
  className?: string;
}

function TotalDepositSectionBase({ className }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { parsedData: totalDeposit, refetch } = useTotalDeposit();

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog();
  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  const openDeposit = useCallback(async () => {
    const { refresh } = await openDepositDialog({});

    if (refresh) {
      await refetch();
    }
  }, [openDepositDialog, refetch]);

  const openWithdraw = useCallback(async () => {
    const { refresh } = await openWithdrawDialog({});

    if (refresh) {
      await refetch();
    }
  }, [openWithdrawDialog, refetch]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const [ust, ustDecimal] = useMemo(() => {
    const value = big(totalDeposit?.totalDeposit ?? 0).div(MICRO);
    return separateBasedOnDecimalPoints(value);
  }, [totalDeposit?.totalDeposit]);

  return (
    <Section className={className}>
      <h2>TOTAL DEPOSIT</h2>

      <div className="amount">
        {ust}
        <span className="decimal-point">.{ustDecimal}</span> UST
      </div>

      <div className="amount-description">
        {toFixedNoRounding(
          big(totalDeposit?.aUSTBalance.balance ?? 0).div(MICRO),
          3,
        )}{' '}
        aUST
      </div>

      <HorizontalRuler />

      <aside className="total-deposit-buttons">
        <ActionButton onClick={() => openDeposit()}>Deposit</ActionButton>
        <ActionButton onClick={() => openWithdraw()}>Withdraw</ActionButton>
      </aside>

      {depositDialogElement}
      {withdrawDialogElement}
    </Section>
  );
}

export const TotalDepositSection = styled(TotalDepositSectionBase)`
  // TODO
`;
