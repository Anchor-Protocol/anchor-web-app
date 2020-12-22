import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import styled from 'styled-components';

export interface MarketProps {
  className?: string;
}

function MarketBase({ className }: MarketProps) {
  return (
    <div className={className}>
      <main>
        <h1>MARKET</h1>

        <div className="content-layout">
          <Section className="total-deposit">
            <h2>
              TOTAL DEPOSIT <span>+12.89%</span>
            </h2>

            <figure className="amount">$ 384,238,213</figure>

            <HorizontalRuler />

            <div className="summary">
              <figure>
                <label>24hr Deposit Volume</label>
                <p>$ 384,238</p>
              </figure>
              <figure>
                <label># of Depositors</label>
                <p>1,238,213</p>
              </figure>
            </div>
          </Section>

          <Section className="total-borrow">
            <h3>
              TOTAL BORROW <span>-8.90%</span>
            </h3>

            <p className="total-deposit-amount">$ 384,238,213</p>
          </Section>
        </div>
      </main>
    </div>
  );
}

export const Market = styled(MarketBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
`;
