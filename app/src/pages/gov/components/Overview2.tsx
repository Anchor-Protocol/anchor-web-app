import { screen } from 'env';
import React from 'react';
import styled from 'styled-components';
import { AncStaked } from './AncStaked';
import { AncLocked } from './AncLocked';
import { AncTrade } from './AncTrade';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  return (
    <div className={className}>
      <AncStaked className="anc-staked" />
      <AncLocked className="anc-locked" />
      <AncTrade className="anc-trade" />
      <AncTrade className="anc-ust-lp" />
    </div>
  );
}

export const Overview2 = styled(OverviewBase)`
  @media (min-width: 1000px) and (max-width: ${screen.pc.max}px) {
    .NeuSection-root {
      margin-bottom: 0;
    }

    display: grid;

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    grid-gap: 40px;

    .anc-staked {
      grid-column: 1;
      grid-row: 1 / 3;
    }

    .anc-locked {
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

    .anc-staked {
      grid-column: 1;
      grid-row: 1 / 3;
    }

    .anc-locked {
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

    // .anc-price,
    // .total-staked {
    //   div {
    //     font-size: 30px;

    //     sub {
    //       font-size: 14px;
    //     }
    //   }
    // }

    // .staked,
    // .lp {
    //   .staking-buttons {
    //     margin-top: 44px;
    //   }

    //   .lp-labels {
    //     margin-top: 44px;
    //   }
    // }
  }
`;
