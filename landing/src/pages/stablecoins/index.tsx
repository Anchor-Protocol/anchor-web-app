import { screen } from 'env';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ChartSection } from './components/ChartSection';
import { InterestRateModelSection } from './components/InterestRateModelSection';
import { MarketDetailsSection } from './components/MarketDetailsSection';

export interface StableCoinsProps {
  className?: string;
}

function StableCoinsBase({ className }: StableCoinsProps) {
  const { stableCoinId } = useParams<{ stableCoinId: string }>();

  return (
    <div className={className}>
      <main>
        <h1>{stableCoinId}</h1>

        <div className="content-layout">
          <ChartSection className="chart" />
          <MarketDetailsSection className="market-details" />
          <InterestRateModelSection className="interest-rate-model" />
        </div>
      </main>
    </div>
  );
}

export const StableCoins = styled(StableCoinsBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  h1 {
    margin: 0 0 40px 0;

    font-size: 44px;
    font-weight: 900;
    color: #1f1f1f;
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  // pc
  @media (min-width: ${screen.pc.min}px) {
    padding: 100px;
  }

  @media (min-width: ${screen.pc.min}px) and (max-width: ${screen.pc.max}px) {
    .NeuSection-root {
      margin-bottom: 40px;
    }
  }

  @media (min-width: ${screen.monitor.min}px) {
    main {
      max-width: 1440px;
      margin: 0 auto;

      .content-layout {
        display: grid;

        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto auto;
        grid-gap: 40px;

        .chart {
          grid-column: 1/4;
          grid-row: 1;
        }

        .market-details {
          grid-column: 1/3;
          grid-row: 2;
        }

        .interest-rate-model {
          grid-column: 3;
          grid-row: 2;
        }
      }
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    padding: 30px;

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    padding: 30px 20px;

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;
