/* tslint:disable */
/* eslint-disable */

import React, { useCallback, useMemo } from 'react';
import { computeTotalDeposit } from '@anchor-protocol/app-fns';
import { useEarnEpochStatesQuery } from '@anchor-protocol/app-provider';
import {
  formatUST,
  formatUSTWithPostfixUnits,
  MILLION,
} from '@anchor-protocol/notation';
import { demicrofy, MICRO } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { SubAmount } from 'components/primitives/SubAmount';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import Big from 'big.js';
import { useDepositDialog } from 'pages/earn/components/useDepositDialog';
import { useWithdrawDialog } from 'pages/earn/components/useWithdrawDialog';

export interface TotalDepositSectionProps {
  className?: string;
  prize: { price: string; description: string; title: string };
}

export function PrizeSection({ className, prize }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { uUST, uaUST } = useBalances();

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
    await openDepositDialog();
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog();
  }, [openWithdrawDialog]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <h2>
        <IconSpan>
          {prize.title}{' '}
          <InfoTooltip>
            Total amount of UST deposited and interest earned by the user
          </InfoTooltip>
        </IconSpan>
      </h2>

      <div className="amount">{prize.price}</div>

      <div className="description">{prize.description}</div>
    </Section>
  );
}
