import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { u, UST } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { demicrofy } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { AnimateNumber } from '@libs/ui';
import big, { Big } from 'big.js';
import React, { useMemo, useState } from 'react';

export interface ExpectedInterestSectionProps {
  className?: string;
}

export type Period = 'total' | 'year' | 'month' | 'week' | 'day';

interface Item {
  label: string;
  value: Period;
}

const tabItems: Item[] = [
  {
    label: 'YEAR',
    value: 'year',
  },
  {
    label: 'MONTH',
    value: 'month',
  },
  {
    label: 'WEEK',
    value: 'week',
  },
  {
    label: 'DAY',
    value: 'day',
  },
];

export function ExpectedInterestSection({
  className,
}: ExpectedInterestSectionProps) {
  const { constants } = useAnchorWebapp();

  const [tab, setTab] = useState<Item>(() => tabItems[0]);

  const {
    tokenBalances: { uaUST },
  } = useAnchorBank();

  const { data: { moneyMarketEpochState, overseerEpochState } = {} } =
    useEarnEpochStatesQuery();

  const expectedInterest = useMemo(() => {
    if (!moneyMarketEpochState || !overseerEpochState) {
      return undefined;
    }

    const ustBalance = big(uaUST).mul(moneyMarketEpochState.exchange_rate);

    const blockApr = parseFloat(overseerEpochState.deposit_rate) + 1;
    const dayInterestRate = big(Math.pow(blockApr, constants.blocksPerYear))
      .sub(1)
      .div(365);

    return ustBalance.mul(
      dayInterestRate
        .add(1)
        .pow(
          tab.value === 'month'
            ? 30
            : tab.value === 'week'
            ? 7
            : tab.value === 'day'
            ? 1
            : 365,
        )
        .sub(1),
    ) as u<UST<Big>>;
  }, [
    constants.blocksPerYear,
    moneyMarketEpochState,
    overseerEpochState,
    tab.value,
    uaUST,
  ]);

  return (
    <Section className={className}>
      <h2>
        <IconSpan>
          EXPECTED INTEREST{' '}
          <InfoTooltip>
            Estimated interest for the selected time period
          </InfoTooltip>
        </IconSpan>
      </h2>

      <div className="amount">
        <span>
          <AnimateNumber format={formatUSTWithPostfixUnits}>
            {expectedInterest
              ? demicrofy(expectedInterest)
              : (0 as UST<number>)}
          </AnimateNumber>{' '}
          <span className="denom">UST</span>
        </span>
      </div>

      <Tab
        className="tab"
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={setTab}
        labelFunction={({ label }) => label}
        keyFunction={({ value }) => value}
        height={46}
        borderRadius={30}
        fontSize={12}
      />
    </Section>
  );
}
