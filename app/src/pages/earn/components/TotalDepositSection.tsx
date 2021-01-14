import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  formatUST,
  mapDecimalPointBaseSeparatedNumbers,
  MICRO,
} from '@anchor-protocol/notation';
import big from 'big.js';
import React, { useCallback } from 'react';
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
  const { parsedData: totalDeposit } = useTotalDeposit();

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog();
  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  const openDeposit = useCallback(async () => {
    await openDepositDialog({});
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    if (totalDeposit) {
      await openWithdrawDialog({ totalDeposit });
    }
  }, [openWithdrawDialog, totalDeposit]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <h2>TOTAL DEPOSIT</h2>

      <div className="amount">
        {mapDecimalPointBaseSeparatedNumbers(
          formatUST(big(totalDeposit?.totalDeposit ?? 0).div(MICRO)),
          (i, d) => {
            return (
              <>
                {i}
                {d ? <span className="decimal-point">.{d}</span> : null} UST
              </>
            );
          },
        )}
      </div>

      <div className="amount-description">
        {formatUST(big(totalDeposit?.aUSTBalance.balance ?? 0).div(MICRO))} aUST
      </div>

      <HorizontalRuler />

      <aside className="total-deposit-buttons">
        <ActionButton onClick={() => openDeposit()}>Deposit</ActionButton>
        <ActionButton disabled={!totalDeposit} onClick={() => openWithdraw()}>
          Withdraw
        </ActionButton>
      </aside>

      {depositDialogElement}
      {withdrawDialogElement}
    </Section>
  );
}

export const TotalDepositSection = styled(TotalDepositSectionBase)`
  // TODO
`;
