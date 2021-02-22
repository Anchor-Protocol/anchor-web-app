import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { screen } from 'env';
import React from 'react';
import styled from 'styled-components';
import { InterestSection } from './components/InterestSection';
import { TotalDepositSection } from './components/TotalDepositSection';
import { TransactionHistorySection } from './components/TransactionHistorySection';

export interface EarnProps {
  className?: string;
}

function EarnBase({ className }: EarnProps) {
  return (
    <PaddedLayout className={className}>
      <section className="grid">
        <TotalDepositSection className="total-deposit" />
        <InterestSection className="interest" />
        <TransactionHistorySection className="transaction-history" />
      </section>
    </PaddedLayout>
  );
}

export const Earn = styled(EarnBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.3px;
    color: ${({ theme }) => theme.textColor};
  }

  hr {
    margin: 30px 0;
  }

  .decimal-point {
    color: ${({ theme }) => theme.dimTextColor};
  }

  .total-deposit {
    .amount {
      font-size: 50px;
      font-weight: 200;
      letter-spacing: -1.5px;
      color: ${({ theme }) => theme.textColor};
    }

    .total-deposit-buttons {
      margin-top: 72px;
    }
  }

  .interest {
    .apy {
      text-align: center;

      .name {
        margin-bottom: 5px;
      }

      .value {
        font-size: 50px;
        font-weight: 300;
        color: ${({ theme }) => theme.positiveTextColor};
        margin-bottom: 50px;
      }

      figure {
        width: 100%;
        height: 200px;
      }
    }

    .earn {
      margin-top: 33px;

      .amount {
        margin-top: 80px;

        text-align: center;
        font-size: 40px;
        font-weight: 300;

        p {
          margin-top: 10px;
          font-size: 13px;
          font-weight: 500;
        }
      }
    }
  }

  .transaction-history {
    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 20px 0;

        .amount {
          font-size: 18px;
          color: ${({ theme }) => theme.textColor};
        }

        .detail {
          margin-top: 5px;

          display: flex;
          justify-content: space-between;

          font-size: 14px;
          color: ${({ theme }) => theme.dimTextColor};
        }

        &:not(:last-child) {
          border-bottom: 1px solid
            ${({ theme }) =>
              rulerShadowColor({
                intensity: theme.intensity,
                color: theme.backgroundColor,
              })};
        }

        &:not(:first-child) {
          border-top: 1px solid
            ${({ theme }) =>
              rulerLightColor({
                intensity: theme.intensity,
                color: theme.backgroundColor,
              })};
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .total-deposit {
    h2 {
      margin-bottom: 15px;
    }

    .total-deposit-buttons {
      display: grid;
      grid-template-columns: repeat(2, 142px);
      justify-content: end;
      grid-gap: 20px;
    }
  }

  .interest {
    h2 {
      margin-bottom: 40px;
    }
  }

  .transaction-history {
    h2 {
      margin-bottom: 16px;
    }

    hr {
      margin: 0 0 10px 0;
    }
  }

  // pc
  @media (min-width: ${screen.monitor.min}px) {
    .grid {
      display: grid;

      grid-template-columns: 1fr 1fr 460px;
      grid-template-rows: auto 425px;
      grid-gap: 40px;

      .NeuSection-root {
        margin: 0;
      }

      .total-deposit {
        grid-column: 1/3;
        grid-row: 1;
      }

      .interest {
        grid-column: 3;
        grid-row: 1/3;
      }

      .transaction-history {
        grid-column: 1/3;
        grid-row: 2/3;
      }
    }

    .interest {
      .NeuSection-content {
        padding: 60px 40px;
      }
    }

    .transaction-history {
      ul {
        max-height: 240px;
        overflow-y: auto;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .decimal-point {
      display: none;
    }

    .total-deposit {
      h2 {
        margin-bottom: 10px;
      }

      .amount {
        font-size: 50px;
      }

      .total-deposit-buttons {
        margin-top: 40px;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 15px;
      }
    }
  }
`;
