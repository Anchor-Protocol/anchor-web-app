import {
  APYChart,
  APYChartItem,
} from '@anchor-protocol/webapp-charts/APYChart';
import {
  AnimateNumber,
  demicrofy,
  formatRate,
  formatUST,
} from '@anchor-protocol/notation';
import { Rate, UST } from '@anchor-protocol/types';
import { useConstants } from 'base/contexts/contants';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Label } from '@terra-dev/neumorphism-ui/components/Label';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import big from 'big.js';
import { currentAPY } from 'pages/earn/logics/currentAPY';
import { useAPYHistory } from 'pages/earn/queries/apyHistory';
import { useInterest } from 'pages/earn/queries/interest';
import { Period, useInterestEarned } from 'pages/earn/queries/interestEarned';
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
    label: 'TOTAL',
    value: 'total',
  },
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
    data: { interestEarned },
  } = useInterestEarned(tab.value);

  const {
    data: { apyHistory },
  } = useAPYHistory();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
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
        <Tooltip title="Annual Percentage Yield" placement="top">
          <Label className="name">APY</Label>
        </Tooltip>
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
            <AnimateNumber format={formatUST}>
              {interestEarned ? demicrofy(interestEarned) : (0 as UST<number>)}
            </AnimateNumber>{' '}
            UST
          </span>
          <p>
            <IconSpan>
              Interest earned{' '}
              <InfoTooltip>
                Interest accrued for the selected time period
              </InfoTooltip>
            </IconSpan>
          </p>
        </div>
      </article>
    </Section>
  );
}
