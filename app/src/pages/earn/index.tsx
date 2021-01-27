import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { Footer } from 'components/Footer';
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
    <div className={className}>
      <main>
        <h1>EARN</h1>

        <div className="content-layout">
          <TotalDepositSection className="total-deposit" />
          <InterestSection className="interest" />
          <TransactionHistorySection className="transaction-history" />
        </div>

        <Footer />
      </main>
    </div>
  );
}

export const Earn = styled(EarnBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h1 {
    margin: 0 0 50px 0;

    font-size: 34px;
    font-weight: 900;
    color: ${({ theme }) => theme.textColor};
  }

  h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
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
      font-size: 64px;
      font-weight: 200;
      letter-spacing: -3px;
      color: ${({ theme }) => theme.textColor};
    }

    .amount-description {
      font-size: 14px;
      line-height: 1.5;
      letter-spacing: -0.3px;
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .interest {
    .apy {
      text-align: center;

      .value {
        font-size: 64px;
        font-weight: 300;
        color: ${({ theme }) => theme.textColor};
      }

      .name {
        font-size: 14px;
        color: ${({ theme }) => theme.dimTextColor};

        margin-bottom: 10px;
      }

      figure {
        width: 100%;
        height: 200px;
      }
    }

    .earn {
      ul {
        list-style: none;
        padding: 0;
        display: flex;
        justify-content: center;

        li {
          text-align: center;
          font-size: 12px;
          border-radius: 15px;
          border: 1px solid transparent;
          color: ${({ theme }) => theme.dimTextColor};

          cursor: pointer;
          user-select: none;

          width: 58px;
          padding: 5px 0;

          &:not(:last-child) {
            margin-right: 5px;
          }

          &[data-selected='true'] {
            border: 1px solid ${({ theme }) => theme.textColor};
            color: ${({ theme }) => theme.textColor};
          }
        }

        margin-bottom: 90px;
      }

      .amount {
        text-align: center;
        font-size: 32px;

        p {
          margin-top: 10px;
          font-size: 14px;
          color: ${({ theme }) => theme.dimTextColor};
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

    aside {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
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
      margin-bottom: 20px;
    }
  }

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

        min-height: 800px;

        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto 1fr;
        grid-gap: 40px;

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
    }

    .transaction-history {
      ul {
        max-height: 350px;
        overflow-y: auto;
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

    .decimal-point {
      display: none;
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

      aside {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 15px;
      }
    }
  }
`;
