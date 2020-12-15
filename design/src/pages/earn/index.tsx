import {
  backgroundStyle,
  Box,
  BoxTitle,
  Button,
  HorizontalRuler,
  Title,
} from 'components/style/dark';
import React from 'react';
import styled from 'styled-components';

export interface EarnProps {
  className?: string;
}

function EarnBase({ className }: EarnProps) {
  return (
    <div className={className}>
      <div className="layout">
        <Title>EARN</Title>

        <Box className="total-deposit">
          <div>
            <BoxTitle>TOTAL DEPOSIT</BoxTitle>

            <p className="total-deposit-amount">
              2,320<span>.063700</span> UST
            </p>

            <p className="total-deposit-subamount">12,320.063 aUST</p>

            <HorizontalRuler />

            <div className="total-deposit-buttons">
              <Button>Deposit</Button>
              <Button>Withdraw</Button>
            </div>
          </div>
        </Box>

        <Box className="interest">
          <div>
            <BoxTitle>INTEREST</BoxTitle>
          </div>
        </Box>

        <Box className="transaction-history">
          <div>
            <BoxTitle>TRANSACTION HISTORY</BoxTitle>
          </div>
        </Box>
      </div>
    </div>
  );
}

export const Earn = styled(EarnBase)`
  ${backgroundStyle};

  padding: 100px 0;

  .layout {
    margin: 100px 100px;

    h1 {
      margin: 0 0 50px 0;
    }

    section {
      margin-bottom: 40px;

      > div {
        padding: 60px;
      }
    }

    hr {
      margin: 30px 0;
    }

    .total-deposit {
      .total-deposit-amount {
        font-family: Gotham;
        font-size: 64px;
        font-weight: 200;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: -3px;
        color: #ffffff;
      }

      .total-deposit-subamount {
        opacity: 0.4;
        font-family: Gotham;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: -0.3px;
        color: #ffffff;
      }

      .total-deposit-buttons {
        display: flex;

        > * {
          flex: 1;
        }

        > :not(:last-child) {
          margin-right: 20px;
        }
      }
    }

    .interest {
    }

    .transaction-history {
    }
  }
`;
