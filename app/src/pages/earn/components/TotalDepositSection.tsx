import {
  AnimateNumber,
  demicrofy,
  formatUST,
  formatUSTWithPostfixUnits,
  MICRO,
  MILLION,
} from '@anchor-protocol/notation';
import {
  AnchorTokenBalances,
  computeTotalDeposit,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/webapp-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@libs/webapp-provider';
import { SubAmount } from 'components/primitives/SubAmount';
import React, { useCallback, useMemo } from 'react';
import { useDepositDialog } from './useDepositDialog';
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
  const {
    tokenBalances: { uaUST },
  } = useBank<AnchorTokenBalances>();

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: computeTotalDeposit(uaUST, moneyMarketEpochState),
    };
  }, [moneyMarketEpochState, uaUST]);

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
          {demicrofy(totalDeposit)}
        </AnimateNumber>{' '}
        UST
        {totalDeposit.gt(MILLION * MICRO) && (
          <SubAmount style={{ fontSize: '16px' }}>
            <AnimateNumber format={formatUST}>
              {demicrofy(totalDeposit)}
            </AnimateNumber>{' '}
            UST
          </SubAmount>
        )}
      </div>

      <aside className="total-deposit-buttons">
        <ActionButton
          disabled={!connectedWallet || !moneyMarketEpochState}
          onClick={openDeposit}
        >
          Deposit
        </ActionButton>
        <BorderButton
          disabled={!connectedWallet || !moneyMarketEpochState}
          onClick={openWithdraw}
        >
          Withdraw
        </BorderButton>
      </aside>

      {depositDialogElement}
      {withdrawDialogElement}
    </Section>
  );
}
