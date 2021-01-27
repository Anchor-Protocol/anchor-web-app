import { LineChart } from '@anchor-protocol/app-charts/LineChart';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { formatRatioToPercentage } from '@anchor-protocol/notation';
import { useInterest } from 'pages/earn/queries/interest';
import styled from 'styled-components';

export interface InterestSectionProps {
  className?: string;
}

function InterestSectionBase({ className }: InterestSectionProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { parsedData: interest } = useInterest();

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
        <div className="value">
          {interest?.currentAPY
            ? formatRatioToPercentage(interest.currentAPY)
            : 0}
          %
        </div>
        <p className="name">
          <IconSpan>
            APY <InfoTooltip>Annual Percentage Yield</InfoTooltip>
          </IconSpan>
        </p>
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

      <HorizontalRuler />

      <article className="earn">
        <ul>
          <li data-selected="true">Total</li>
          <li>Year</li>
          <li>Month</li>
          <li>Week</li>
          <li>Day</li>
        </ul>

        <div className="amount">
          <Tooltip title="no real data" placement="top">
            <span>
              <s>
                2,320<span className="decimal-point">.063700</span> UST
              </s>
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

export const InterestSection = styled(InterestSectionBase)`
  // TODO
`;
