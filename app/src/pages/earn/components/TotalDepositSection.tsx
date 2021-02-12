import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatUST,
  mapDecimalPointBaseSeparatedNumbers,
  Ratio,
  uUST,
} from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { useTotalDeposit } from 'pages/earn/logics/useTotalDeposit';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDeposit } from '../queries/totalDeposit';
import { useDepositDialog } from './useDepositDialog';
import { useWithdrawDialog } from './useWithdrawDialog';

export interface TotalDepositSectionProps {
  className?: string;
}

function TotalDepositSectionBase({ className }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    data: { aUSTBalance, exchangeRate },
  } = useDeposit();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const totalDeposit = useTotalDeposit(
    aUSTBalance?.balance,
    exchangeRate?.exchange_rate,
  );

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog();
  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  const openDeposit = useCallback(async () => {
    await openDepositDialog({});
  }, [openDepositDialog]);

  const openWithdraw = useCallback(
    async (totalDeposit: uUST<BigSource>, exchangeRate: Ratio<BigSource>) => {
      if (totalDeposit) {
        await openWithdrawDialog({
          totalDeposit,
          exchangeRate,
        });
      }
    },
    [openWithdrawDialog],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <h2>
        <IconSpan>
          TOTAL DEPOSIT{' '}
          <InfoTooltip>
            Total amount of UST deposited and interest earned by the user
          </InfoTooltip>
        </IconSpan>
      </h2>

      <div className="amount">
        {mapDecimalPointBaseSeparatedNumbers(
          formatUST(demicrofy(totalDeposit)),
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

      <aside className="total-deposit-buttons">
        <ActionButton disabled={!totalDeposit} onClick={() => openDeposit()}>
          Deposit
        </ActionButton>
        <ActionButton
          disabled={!totalDeposit || !exchangeRate?.exchange_rate}
          onClick={() =>
            openWithdraw(totalDeposit, exchangeRate!.exchange_rate)
          }
        >
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
