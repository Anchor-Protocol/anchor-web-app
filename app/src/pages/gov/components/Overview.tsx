import { screen } from 'env';
import React from 'react';
import styled from 'styled-components';
import { AncTrade } from './AncTrade';
import { AncUstLp } from './AncUstLp';
import { AncTokenOverview } from './AncTokenOverview';
import { MyAncTokenOverview } from './MyAncTokenOverview';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  return (
    <div className={className}>
      <AncTokenOverview className="anc-token" />
      <MyAncTokenOverview className="my-anc" />
      <AncTrade className="anc-trade" />
      <AncUstLp className="anc-ust-lp" />
    </div>
  );
}

export const Overview = styled(OverviewBase)`
  @media (min-width: 1000px) and (max-width: ${screen.pc.max}px) {
    .NeuSection-root {
      margin-bottom: 0;
    }

    display: grid;

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    grid-gap: 40px;

    .anc-token {
      grid-column: 1;
      grid-row: 1 / 3;
    }

    .my-anc {
      grid-column: 2;
      grid-row: 1 / 3;
    }

    .anc-trade {
      grid-column: 3;
      grid-row: 1;
    }

    .anc-ust-lp {
      grid-column: 3;
      grid-row: 2;
    }
  }

  @media (min-width: ${screen.monitor.min}px) {
    .NeuSection-root {
      margin-bottom: 0;
    }

    display: grid;

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    grid-gap: 40px;

    .anc-token {
      grid-column: 1;
      grid-row: 1 / 3;
    }

    .my-anc {
      grid-column: 2;
      grid-row: 1 / 3;
    }

    .anc-trade {
      grid-column: 3;
      grid-row: 1;
    }

    .anc-ust-lp {
      grid-column: 3;
      grid-row: 2;
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    .NeuSection-root {
      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .NeuSection-root {
      margin-bottom: 20px;

      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;
