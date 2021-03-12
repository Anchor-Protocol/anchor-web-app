import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatUST,
  mapDecimalPointBaseSeparatedNumbers,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { BigSource } from 'big.js';
import React, { useCallback, useMemo } from 'react';
import { totalDepositUST } from '../logics/totalDepositUST';
import { useDeposit } from '../queries/totalDeposit';
import { useDepositDialog } from './useDepositDialog';
import { useWithdrawDialog } from './useWithdrawDialog';

export interface TotalDepositSectionProps {
  className?: string;
}

export function TotalDepositSection({ className }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    data: { aUSTBalance, exchangeRate },
  } = useDeposit();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const totalDeposit = useMemo(
    () => totalDepositUST(aUSTBalance, exchangeRate),
    [aUSTBalance, exchangeRate],
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
    async (totalDeposit: uUST<BigSource>, exchangeRate: Rate<BigSource>) => {
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
        <ActionButton
          disabled={status.status !== 'ready' || !totalDeposit}
          onClick={() => openDeposit()}
        >
          Deposit
        </ActionButton>
        <ActionButton
          disabled={
            status.status !== 'ready' ||
            !totalDeposit ||
            !exchangeRate?.exchange_rate
          }
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
