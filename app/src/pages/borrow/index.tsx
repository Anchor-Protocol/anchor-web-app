import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { Footer } from 'components/Footer';
import { screen } from 'env';
import { LoanButtons } from 'pages/borrow/components/LoanButtons';
import { Overview } from 'pages/borrow/components/Overview';
import { MarketProvider } from 'pages/borrow/context/market';
import React from 'react';
import styled from 'styled-components';
import { CollateralList } from './components/CollateralList';

export interface BorrowProps {
  className?: string;
}

function BorrowBase({ className }: BorrowProps) {
  return (
    <MarketProvider>
      <div className={className}>
        <main>
          <div className="market">
            <h1>UST</h1>
            <div className="loan-buttons">
              <LoanButtons />
            </div>
          </div>

          <div className="content-layout">
            <Overview className="borrow" />
            <CollateralList className="collateral-list" />
          </div>

          <Footer />
        </main>
      </div>
    </MarketProvider>
  );
}

export const Borrow = styled(BorrowBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  .market {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    h1 {
      font-size: 44px;
      font-weight: 900;
      color: ${({ theme }) => theme.textColor};
    }

    .loan-buttons {
      display: grid;
      grid-template-columns: repeat(2, 180px);
      grid-gap: 10px;

      button {
        height: 48px;
        border-radius: 26px;
      }
    }
  }

  h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: ${({ theme }) => theme.textColor};
  }

  .borrow {
    article {
      text-align: center;

      > div {
        padding: 20px 0;

        p:nth-child(2) {
          margin-top: 18px;
          font-weight: 300;
          font-size: 40px;
        }

        p:nth-child(3) {
          margin-top: 5px;
          font-weight: 300;
          font-size: 13px;
          color: ${({ theme }) => theme.dimTextColor};
        }
      }

      margin-bottom: 80px;
    }

    figure {
      height: 53px;
    }
  }

  .collateral-list,
  .loan-list {
    table {
      thead {
        th {
          text-align: right;

          &:first-child {
            font-weight: bold;
            color: ${({ theme }) => theme.textColor};
            text-align: left;
          }
        }
      }

      tbody {
        td {
          text-align: right;

          .value,
          .coin {
            font-size: 18px;
          }

          .volatility,
          .name {
            font-size: 13px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child {
            text-align: left;

            display: flex;

            align-items: center;

            i {
              width: 60px;
              height: 60px;

              margin-right: 15px;

              svg {
                display: block;
                width: 60px;
                height: 60px;
              }
            }

            .coin {
              font-weight: bold;

              grid-column: 2;
              grid-row: 1/2;
            }

            .name {
              grid-column: 2;
              grid-row: 2;
            }
          }

          &:last-child {
            button {
              padding-left: 20px;
              padding-right: 20px;

              &:not(:last-child) {
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .collateral-list,
  .loan-list {
    h2 {
      margin-bottom: 30px;
    }
  }

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

    .market {
      flex-direction: column;
      align-items: center;

      .loan-buttons {
        width: 500px;
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
      }
    }

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

    .market {
      flex-direction: column;
      align-items: center;

      .loan-buttons {
        width: 100%;
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .collateral-list,
    .loan-list {
      h2 {
        margin-bottom: 20px;
      }
    }
  }

  // borrow
  @media (min-width: 1200px) {
    .borrow {
      article {
        display: flex;

        div {
          flex: 1;

          &:not(:last-child) {
            border-right: 1px solid
              ${({ theme }) =>
                rulerShadowColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                })};
          }

          &:not(:first-child) {
            border-left: 1px solid
              ${({ theme }) =>
                rulerLightColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                })};
          }
        }
      }
    }
  }

  @media (max-width: 1199px) {
    .borrow {
      article {
        display: flex;
        flex-direction: column;

        div {
          flex: 1;

          &:not(:last-child) {
            padding-bottom: 20px;
            border-bottom: 1px solid
              ${({ theme }) =>
                rulerShadowColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                })};
          }

          &:not(:first-child) {
            padding-top: 20px;
            border-top: 1px solid
              ${({ theme }) =>
                rulerLightColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                })};
          }

          p {
            font-size: 48px;
          }
        }
      }
    }
  }
`;
