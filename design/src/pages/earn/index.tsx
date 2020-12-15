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
            <HorizontalRuler />

            <div>
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
    }

    .interest {
    }

    .transaction-history {
    }
  }
`;
