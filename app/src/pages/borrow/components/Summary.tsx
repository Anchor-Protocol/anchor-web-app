import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import styled from 'styled-components';

export interface SummaryProps {
  className?: string;
}

function SummaryBase({ className }: SummaryProps) {
  return (
    <Section className={`borrow ${className}`}>
      <article>
        <div>
          <label>APR</label>
          <p>2.60%</p>
        </div>

        <div>
          <label>Collateral Value</label>
          <p>$420,000.00</p>
        </div>

        <div>
          <label>Borrowed Value</label>
          <p>$420,000.00</p>
        </div>
      </article>

      <figure></figure>
    </Section>
  );
}

export const Summary = styled(SummaryBase)`
  // TODO
`;
