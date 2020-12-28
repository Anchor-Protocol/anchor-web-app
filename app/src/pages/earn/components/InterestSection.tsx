import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import styled from 'styled-components';

export interface InterestSectionProps {
  className?: string;
}

function InterestSectionBase({ className }: InterestSectionProps) {
  return (
    <Section className={className}>
      <h2>INTEREST</h2>

      <div className="apy">
        <div className="value">9.36%</div>
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
          2,320<span className="decimal-point">.063700</span> UST
          <p>Interest earned</p>
        </div>
      </article>
    </Section>
  );
}

export const InterestSection = styled(InterestSectionBase)`
  // TODO
`;
