import {
  AnimateNumber,
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { UST } from '@anchor-protocol/types';
import { useEarnTotalDepositQuery } from '@anchor-protocol/webapp-provider';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import React, { useCallback } from 'react';
import { useDepositDialog } from './useDepositDialog2';
import { useWithdrawDialog } from './useWithdrawDialog2';

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
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog();
  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  const openDeposit = useCallback(async () => {
    await openDepositDialog({});
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog({});
  }, [openWithdrawDialog]);

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
          {data ? demicrofy(data.totalDeposit) : ('0' as UST)}
        </AnimateNumber>{' '}
        UST
      </div>

      <aside className="total-deposit-buttons">
        <ActionButton
          disabled={!connectedWallet || !data}
          onClick={openDeposit}
        >
          Deposit
        </ActionButton>
        <ActionButton
          disabled={!connectedWallet || !data}
          onClick={openWithdraw}
        >
          Withdraw
        </ActionButton>
      </aside>

      {depositDialogElement}
      {withdrawDialogElement}
    </Section>
  );
}
