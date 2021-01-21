import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  formatUST,
  mapDecimalPointBaseSeparatedNumbers,
  MICRO,
} from '@anchor-protocol/notation';
import big from 'big.js';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
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
      <h2>
        <IconSpan>
          TOTAL DEPOSIT{' '}
          <InfoTooltip>The sum of current deposits on Anchor</InfoTooltip>
        </IconSpan>
      </h2>

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
      
      <HorizontalRuler />

      <aside className="total-deposit-buttons">
        <ActionButton disabled={!totalDeposit} onClick={() => openDeposit()}>
          Deposit
        </ActionButton>
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
