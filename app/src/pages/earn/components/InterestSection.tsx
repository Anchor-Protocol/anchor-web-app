import { APYChart, APYChartItem } from '@anchor-protocol/app-charts/APYChart';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Label } from '@anchor-protocol/neumorphism-ui/components/Label';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUST,
  mapDecimalPointBaseSeparatedNumbers,
  Ratio,
} from '@anchor-protocol/notation';
import { useConstants } from 'contexts/contants';
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

  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    return apyHistory?.map(({ Timestamp, DepositRate }) => ({
      date: new Date(Timestamp * 1000),
      value: parseFloat(DepositRate) as Ratio<number>,
    }));
  }, [apyHistory]);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const apy = useMemo(
    () => currentAPY(marketStatus?.deposit_rate, blocksPerYear),
    [blocksPerYear, marketStatus?.deposit_rate],
  );

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
        <div className="value">{formatRatioToPercentage(apy)}%</div>
        {apyChartItems && (
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 50, left: 100, right: 100 }}
            data={apyChartItems}
            minY={0}
            maxY={1.3}
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
          <Tooltip
            title={
              'This is debug message. interest_earned is ' +
              String(interestEarned)
            }
            placement="top"
          >
            <span>
              {interestEarned
                ? mapDecimalPointBaseSeparatedNumbers(
                    formatUST(demicrofy(interestEarned)),
                    (i, d) => {
                      return (
                        <>
                          {i}
                          {d ? (
                            <span className="decimal-point">.{d}</span>
                          ) : null}{' '}
                          UST
                        </>
                      );
                    },
                  )
                : '0 UST'}
            </span>
          </Tooltip>
          <p>
            <IconSpan>
              Interest earned{' '}
              <InfoTooltip>
                Total amount of interest accrued for the selected time period
              </InfoTooltip>
            </IconSpan>
          </p>
        </div>
      </article>
    </Section>
  );
}
