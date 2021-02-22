import { AnchorNoCircle } from '@anchor-protocol/icons';
import { BorderButton } from '@anchor-protocol/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Label } from '@anchor-protocol/neumorphism-ui/components/Label';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { ChevronRight } from '@material-ui/icons';
import { Circles } from 'components/Circles';
import { screen } from 'env';
import { govPathname } from 'pages/gov/env';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  return (
    <div className={className}>
      <Section className="anc-price">
        <h2>ANC PRICE</h2>
        <div>13.38 UST</div>
      </Section>
      <Section className="total-staked">
        <h2>TOTAL STAKED</h2>
        <div>
          1.42M ANC <sub>(11.3%)</sub>
        </div>
      </Section>
      <Section className="staking">
        <Circles backgroundColor="#ffffff">
          <AnchorNoCircle style={{ fontSize: '1.4em' }} />
        </Circles>
        <h2>Anchor Governance Staking</h2>
        <div className="staking-apy">
          <Label>APY</Label>
          <span>8.32%</span>
        </div>
        <div className="staking-buttons">
          <BorderButton component={Link} to={`/${govPathname}/trade`}>
            Trade ANC
          </BorderButton>
          <BorderButton
            component={Link}
            to={`/${govPathname}/pool/Governance Staking/stake`}
          >
            Stake
          </BorderButton>
        </div>
      </Section>
      <Section className="lp">
        <Circles backgroundColor="#ffffff">
          <TokenIcon token="ust" variant="@3x" style={{ fontSize: '1.1em' }} />
          <AnchorNoCircle style={{ fontSize: '1.4em' }} />
        </Circles>
        <h2>
          <Link to={`/${govPathname}/pool/ANC - UST LP/provide`}>
            <IconSpan>
              ANC - UST LP <ChevronRight />
            </IconSpan>
          </Link>
        </h2>
        <div className="lp-labels">
          <div>
            <Label>APY</Label>
            <p>12.39%</p>
          </div>
          <div>
            <Label>Total Staked</Label>
            <p>13,413</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export const Overview = styled(OverviewBase)`
  // ---------------------------------------------
  // styles
  // ---------------------------------------------
  .lp {
    a {
      text-decoration: none;
      color: ${({ theme }) => theme.textColor};
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .anc-price,
  .total-staked {
    display: grid;
    align-items: center;

    .NeuSection-content {
      padding: 40px;
    }

    h2 {
      font-size: 13px;
      font-weight: 500;

      margin-bottom: 10px;
    }

    div {
      font-size: 36px;
      font-weight: 300;

      sub {
        font-size: 18px;
        vertical-align: middle;
        color: ${({ theme }) => theme.dimTextColor};
      }
    }
  }

  .staking,
  .lp {
    text-align: center;

    .NeuSection-content {
      padding: 90px 40px 40px 40px;
    }

    h2 {
      margin-top: 15px;

      font-size: 18px;
      font-weight: 500;
    }

    .staking-apy {
      margin-top: 15px;

      display: flex;
      justify-content: center;
      align-items: center;

      > :first-child {
        margin-right: 10px;
      }
    }

    .staking-buttons {
      margin-top: 84px;

      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
    }

    .lp-labels {
      margin-top: 84px;

      display: flex;
      justify-content: space-evenly;

      > div {
        > :first-child {
          padding: 5px;
          width: 110px;
          margin-bottom: 5px;
        }

        > :last-child {
          font-size: 18px;
        }
      }
    }
  }

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
