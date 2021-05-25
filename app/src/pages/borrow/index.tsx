import { TokenIcon } from '@anchor-protocol/token-icons';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { screen } from 'env';
import { LoanButtons } from 'pages/borrow/components/LoanButtons';
import { Overview } from 'pages/borrow/components/Overview';
import React from 'react';
import styled from 'styled-components';
import { CollateralList } from './components/CollateralList';

export interface BorrowProps {
  className?: string;
}

function BorrowBase({ className }: BorrowProps) {
  return (
    <PaddedLayout className={className}>
      <div className="market">
        <h1>
          <TokenIcon token="ust" /> UST
        </h1>
        <div className="loan-buttons">
          <LoanButtons />
        </div>
      </div>

      <Overview className="borrow" />
      <CollateralList className="collateral-list" />
    </PaddedLayout>
  );
}

export const Borrow = styled(BorrowBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  .market {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    h1 {
      font-size: 44px;
      font-weight: 900;
      color: ${({ theme }) => theme.textColor};

      img {
        transform: scale(1.3) translateY(3px);
        margin-right: 5px;
      }
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

              svg,
              img {
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

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    .market {
      flex-direction: column;
      align-items: center;

      .loan-buttons {
        width: 500px;
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .market {
      flex-direction: column;
      align-items: center;

      .loan-buttons {
        width: 100%;
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
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
  @media (min-width: 1400px) {
    .borrow {
      article {
        display: flex;

        > div {
          flex: 1;

          &:not(:first-child) {
            margin-left: 18px;
          }
        }
      }
    }
  }

  @media (max-width: 1399px) {
    .borrow {
      article {
        display: flex;
        flex-direction: column;

        > div {
          flex: 1;

          &:not(:first-child) {
            margin-top: 18px;
          }
        }
      }
    }
  }
`;
