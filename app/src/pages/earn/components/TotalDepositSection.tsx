import {
  AnimateNumber,
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { useEarnTotalDepositQuery } from '@anchor-protocol/webapp-provider';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big, BigSource } from 'big.js';
import React, { useCallback, useMemo } from 'react';
import { totalDepositUST } from '../logics/totalDepositUST';
import { useDepositDialog } from './useDepositDialog2';
import { useWithdrawDialog } from './useWithdrawDialog';

export interface TotalDepositSectionProps {
  className?: string;
}

export function TotalDepositSection({ className }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data } = useEarnTotalDepositQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const totalDeposit = useMemo(
    () =>
      data
        ? totalDepositUST(data.aUSTBalance, data.exchangeRate)
        : (big(0) as uUST<Big>),
    [data],
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
        <AnimateNumber format={formatUSTWithPostfixUnits}>
          {demicrofy(totalDeposit)}
        </AnimateNumber>{' '}
        UST
      </div>

      <aside className="total-deposit-buttons">
        <ActionButton
          disabled={!connectedWallet || !totalDeposit || !data}
          onClick={() => openDeposit()}
        >
          Deposit
        </ActionButton>
        <ActionButton
          disabled={!connectedWallet || !totalDeposit || !data}
          onClick={() =>
            data && openWithdraw(totalDeposit, data.exchangeRate.exchange_rate)
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
