import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface MarketDetailsSectionProps {
  className?: string;
}

function MarketDetailsSectionBase({ className }: MarketDetailsSectionProps) {
  const { ref: articleRef, width = 800 } = useResizeObserver<HTMLElement>({});

  return (
    <Section className={className} data-columns={width > 800 ? 2 : 1}>
      <h2>MARKET DETAILS</h2>

      <HorizontalHeavyRuler />

      <article ref={articleRef}>
        <div>
          <div>
            <label>Price</label>
            <p>$1.00</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>Marker Liquidity</label>
            <p>100,232,859 UST</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label># of Suppliers</label>
            <p>142,954</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label># of Borrowers</label>
            <p>9,230</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>Deposit APY</label>
            <p>8.15%</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>Borrow APR</label>
            <p>12.32%</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>Daily interest</label>
            <p>$51,232</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>Interest from borrow</label>
            <p>$32,232</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>Interest from Staking Reward</label>
            <p>$20,000</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>aToken Supply</label>
            <p>349,119,129</p>
          </div>
          <HorizontalRuler />
        </div>
        <div>
          <div>
            <label>Exchange Rate</label>
            <p>
              1 UST = 1.<sub>4294838294</sub> aUST
            </p>
          </div>
          <HorizontalRuler />
        </div>
      </article>
    </Section>
  );
}

export const MarketDetailsSection = styled(MarketDetailsSectionBase)`
  h2 {
    font-size: 13px;
    font-weight: 500;
    color: #1f1f1f;
  }

  hr {
    margin: 16px 0 0 0;
  }

  article {
    > div {
      div {
        height: 69px;

        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      label {
        font-size: 13px;
        color: #8a8a8a;
      }

      p {
        font-size: 18px;
        color: #1f1f1f;

        sub {
          font-size: 11px;
          vertical-align: bottom;
        }
      }

      hr {
        margin: 0;
      }
    }
  }

  &[data-columns='2'] {
    article {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 110px;
    }
  }
`;
