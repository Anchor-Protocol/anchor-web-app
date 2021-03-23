import {
  AnimateNumber,
  demicrofy,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, UST, uUST } from '@anchor-protocol/types';
import {
  APYChart,
  APYChartItem,
} from '@anchor-protocol/webapp-charts/APYChart';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import { TooltipLabel } from '@terra-dev/neumorphism-ui/components/TooltipLabel';
import { useConstants } from 'base/contexts/contants';
import big, { Big } from 'big.js';
import { currentAPY } from 'pages/earn/logics/currentAPY';
import { useAPYHistory } from 'pages/earn/queries/apyHistory';
import { useExpectedInterest } from 'pages/earn/queries/expectedInterest';
import { useInterest } from 'pages/earn/queries/interest';
import { Period } from 'pages/earn/queries/interestEarned';
import { useMemo, useState } from 'react';

export interface InterestSectionProps {
  className?: string;
}

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

export function InterestSection({ className }: InterestSectionProps) {
  const { blocksPerYear } = useConstants();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [tab, setTab] = useState<Item>(() => tabItems[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    data: { marketStatus },
  } = useInterest();

  const {
    data: { apyHistory },
  } = useAPYHistory();

  const {
    data: { aUSTBalance, moneyMarketEpochState, overseerEpochState },
  } = useExpectedInterest();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const expectedReturn = useMemo(() => {
    if (!aUSTBalance || !moneyMarketEpochState || !overseerEpochState) {
      return undefined;
    }

    const ustBalance = big(aUSTBalance.balance).mul(
      moneyMarketEpochState.exchange_rate,
    );
    const annualizedInterestRate = big(overseerEpochState.deposit_rate).mul(
      blocksPerYear,
    );

    return ustBalance
      .mul(annualizedInterestRate)
      .div(
        tab.value === 'month'
          ? 12
          : tab.value === 'week'
          ? 52
          : tab.value === 'day'
          ? 365
          : 1,
      ) as uUST<Big>;
  }, [
    aUSTBalance,
    blocksPerYear,
    moneyMarketEpochState,
    overseerEpochState,
    tab.value,
  ]);

  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ]);

  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    const history = apyHistory
      ?.map(({ Timestamp, DepositRate }) => ({
        date: new Date(Timestamp * 1000),
        value: (parseFloat(DepositRate) * blocksPerYear) as Rate<number>,
      }))
      .reverse();

    return history && marketStatus
      ? [
          ...history,
          {
            date: new Date(),
            value: big(marketStatus.deposit_rate)
              .mul(blocksPerYear)
              .toNumber() as Rate<number>,
          },
        ]
      : undefined;
  }, [apyHistory, blocksPerYear, marketStatus]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <h2>
        <IconSpan>
          INTEREST <InfoTooltip>Current annualized deposit rate</InfoTooltip>
        </IconSpan>
      </h2>

      <div className="apy">
        <TooltipLabel
          className="name"
          title="Annual Percentage Yield"
          placement="top"
        >
          APY
        </TooltipLabel>
        <div className="value">
          <AnimateNumber format={formatRate}>{apy}</AnimateNumber>%
        </div>
        {apyChartItems && (
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
          />
        )}
      </div>

      <article className="earn">
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

        <div className="amount">
          <span>
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {expectedReturn ? demicrofy(expectedReturn) : (0 as UST<number>)}
            </AnimateNumber>{' '}
            UST
          </span>
          <p>
            <IconSpan>
              Expected Interest{' '}
              <InfoTooltip>
                Estimated interest for the selected time period
              </InfoTooltip>
            </IconSpan>
          </p>
        </div>
      </article>
    </Section>
  );
}
