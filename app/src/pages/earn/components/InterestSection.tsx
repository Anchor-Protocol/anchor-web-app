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
import {
  AnchorTokenBalances,
  computeCurrentAPY,
  useAnchorWebapp,
  useEarnAPYHistoryQuery,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/webapp-provider';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Tab } from '@terra-dev/neumorphism-ui/components/Tab';
import { TooltipLabel } from '@terra-dev/neumorphism-ui/components/TooltipLabel';
import { useBank } from '@terra-money/webapp-provider';
import big, { Big } from 'big.js';
import { useMemo, useState } from 'react';

export interface InterestSectionProps {
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

export function InterestSection({ className }: InterestSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { constants } = useAnchorWebapp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [tab, setTab] = useState<Item>(() => tabItems[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    tokenBalances: { uaUST },
  } = useBank<AnchorTokenBalances>();

  const { data: { apyHistory } = {} } = useEarnAPYHistoryQuery();

  const {
    data: { moneyMarketEpochState, overseerEpochState } = {},
  } = useEarnEpochStatesQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const expectedInterest = useMemo(() => {
    if (!moneyMarketEpochState || !overseerEpochState) {
      return undefined;
    }

    const ustBalance = big(uaUST).mul(moneyMarketEpochState.exchange_rate);
    const annualizedInterestRate = big(overseerEpochState.deposit_rate).mul(
      constants.blocksPerYear,
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
    constants.blocksPerYear,
    moneyMarketEpochState,
    overseerEpochState,
    tab.value,
    uaUST,
  ]);

  const apy = useMemo(() => {
    return computeCurrentAPY(overseerEpochState, constants.blocksPerYear);
  }, [constants.blocksPerYear, overseerEpochState]);

  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    const history = apyHistory
      ?.map(({ Timestamp, DepositRate }) => ({
        date: new Date(Timestamp * 1000),
        value: (parseFloat(DepositRate) *
          constants.blocksPerYear) as Rate<number>,
      }))
      .reverse();

    return history && overseerEpochState
      ? [
          ...history,
          {
            date: new Date(),
            value: big(overseerEpochState.deposit_rate)
              .mul(constants.blocksPerYear)
              .toNumber() as Rate<number>,
          },
        ]
      : undefined;
  }, [apyHistory, constants.blocksPerYear, overseerEpochState]);

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
              {expectedInterest
                ? demicrofy(expectedInterest)
                : (0 as UST<number>)}
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
