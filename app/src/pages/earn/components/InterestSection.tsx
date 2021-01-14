import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { formatPercentage } from '@anchor-protocol/notation';
import big from 'big.js';
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
      <h2>INTEREST</h2>

      <div className="apy">
        <div className="value">
          {formatPercentage(big(interest?.currentAPY ?? 0).mul(100))}%
        </div>
        <p className="name">APY</p>
        <figure></figure>
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
              <s>2,320<span className="decimal-point">.063700</span> UST</s>
            </span>
          </Tooltip>
          <p>Interest earned</p>
        </div>
      </article>
    </Section>
  );
}

export const InterestSection = styled(InterestSectionBase)`
  // TODO
`;
