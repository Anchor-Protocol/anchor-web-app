import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { screen } from 'env';
import styled from 'styled-components';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  return (
    <div className={className}>
      <Section className="anc-price">
        <h2>ANC PRICE</h2>
      </Section>
      <Section className="total-staked">
        <h2>TOTAL STAKED</h2>
      </Section>
      <Section className="staking">
        <h2>STAKING</h2>
      </Section>
      <Section className="lp">
        <h2>ANC - UST LP</h2>
      </Section>
    </div>
  );
}

export const Overview = styled(OverviewBase)`
  @media (min-width: 1000px) and (max-width: ${screen.pc.max}px) {
    .NeuSection-root {
      margin-bottom: 0;
    }

    display: grid;

    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 200px);
    grid-gap: 40px;

    .anc-price {
      grid-column: 1;
      grid-row: 1;
    }

    .total-staked {
      grid-column: 2;
      grid-row: 1;
    }

    .staking {
      grid-column: 1;
      grid-row: 2/4;
    }

    .lp {
      grid-column: 2;
      grid-row: 2/4;
    }
  }

  @media (min-width: ${screen.monitor.min}px) {
    .NeuSection-root {
      margin-bottom: 0;
    }

    display: grid;

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 200px);
    grid-gap: 40px;

    .anc-price {
      grid-column: 1;
      grid-row: 1;
    }

    .total-staked {
      grid-column: 1;
      grid-row: 2;
    }

    .staking {
      grid-column: 2;
      grid-row: 1/3;
    }

    .lp {
      grid-column: 3;
      grid-row: 1/3;
    }
  }
`;
