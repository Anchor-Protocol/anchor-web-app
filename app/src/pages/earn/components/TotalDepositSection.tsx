import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { SubAmount } from 'components/primitives/SubAmount';
import React from 'react';

export interface TotalDepositSectionProps {
  className?: string;
}

export function TotalDepositSection({ className }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  // const connectedWallet = useConnectedWallet();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  // const {
  //   tokenBalances: { uaUST },
  // } = useAnchorBank();

  // const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  // const { totalDeposit } = useMemo(() => {
  //   return {
  //     totalDeposit: computeTotalDeposit(uaUST, moneyMarketEpochState),
  //   };
  // }, [moneyMarketEpochState, uaUST]);

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  // const [openDepositDialog, depositDialogElement] = useDepositDialog();

  // const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  // const openDeposit = useCallback(async () => {
  //   await openDepositDialog({});
  // }, [openDepositDialog]);

  // const openWithdraw = useCallback(async () => {
  //   await openWithdrawDialog({});
  // }, [openWithdrawDialog]);

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
        30 UST
        {<SubAmount style={{ fontSize: '16px' }}>40 UST</SubAmount>}
      </div>

      <aside className="total-deposit-buttons">
        <ActionButton disabled={true} onClick={() => {}}>
          Deposit
        </ActionButton>
        <BorderButton disabled={true} onClick={() => {}}>
          Withdraw
        </BorderButton>
      </aside>

      {/* {depositDialogElement}
      {withdrawDialogElement} */}
    </Section>
  );
}
