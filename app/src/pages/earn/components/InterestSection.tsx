import { LineChart } from '@anchor-protocol/app-charts/LineChart';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Label } from '@anchor-protocol/neumorphism-ui/components/Label';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { formatRatioToPercentage } from '@anchor-protocol/notation';
import { useConstants } from 'contexts/contants';
import { useCurrentAPY } from 'pages/earn/logics/useCurrentAPY';
import { useInterest } from 'pages/earn/queries/interest';
import { useState } from 'react';

export interface InterestSectionProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
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

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentAPY = useCurrentAPY(marketStatus?.deposit_rate, blocksPerYear);

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
        <div className="value">{formatRatioToPercentage(currentAPY)}%</div>
        <LineChart
          data={[
            { label: 'A', date: 0, value: 100 },
            { label: 'B', date: 1, value: 10 },
            { label: 'C', date: 2, value: 70 },
            { label: 'D', date: 3, value: 130 },
            { label: 'E', date: 4, value: 60 },
            { label: 'F', date: 5, value: 170 },
          ]}
        />
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
            <s>
              2,320<span className="decimal-point">.063700</span> UST
            </s>
          </span>
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
