import { screen } from 'env';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ChartSection } from './ChartSection';
import { MarketDetailsSection } from './MarketDetailsSection';

export interface BAssetsProps {
  className?: string;
}

function BAssetsBase({ className }: BAssetsProps) {
  const { bAssetId } = useParams<{ bAssetId: string }>();

  return (
    <div className={className}>
      <main>
        <h1>{bAssetId}</h1>

        <div className="content-layout">
          <ChartSection className="chart" />
          <MarketDetailsSection className="market-details" />
        </div>
      </main>
    </div>
  );
}

export const BAssets = styled(BAssetsBase)`
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

    .NeuSection-root {
      margin-bottom: 40px;
    }
  }

  @media (min-width: ${screen.monitor.min}px) {
    main {
      max-width: 1440px;
      margin: 0 auto;
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
