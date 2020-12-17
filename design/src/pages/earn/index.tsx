import { ActionButton } from 'components/ui/ActionButton';
import { HorizontalRuler } from 'components/ui/HorizontalRuler';
import { Section } from 'components/ui/Section';
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

        <Section className="total-deposit">
          <div>
            <BoxTitle>TOTAL DEPOSIT</BoxTitle>

            <p className="total-deposit-amount">
              2,320<span className="decimal-point">.063700</span> UST
            </p>

            <p className="total-deposit-subamount">12,320.063 aUST</p>

            <HorizontalRuler />

            <div className="total-deposit-buttons">
              <ActionButton>Deposit</ActionButton>
              <ActionButton>Withdraw</ActionButton>
            </div>
          </div>
        </Section>

        <Section className="interest">
          <div>
            <BoxTitle>INTEREST</BoxTitle>
          </div>
        </Section>

        <Section className="transaction-history">
          <div>
            <BoxTitle>TRANSACTION HISTORY</BoxTitle>
          </div>
        </Section>
      </div>
    </div>
  );
}

export const Title = styled.h1`
  height: 41px;
  font-family: Gotham;
  font-size: 34px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #f0f0f0;
`;

export const BoxTitle = styled.h3`
  margin: 0;
  font-family: Gotham;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.3px;
  color: #ffffff;
`;

export const Earn = styled(EarnBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};

  .layout {
    h1 {
      margin: 0 0 50px 0;

      font-family: Gotham;
      font-size: 34px;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: ${({ theme }) => theme.textColor};
    }

    section {
      margin-bottom: 40px;
    }

    hr {
      margin: 30px 0;
    }
    
    .decimal-point {
      color: ${({ theme }) => theme.dimTextColor};
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
        color: ${({ theme }) => theme.textColor};
      }

      .total-deposit-subamount {
        font-family: Gotham;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: -0.3px;
        color: ${({ theme }) => theme.dimTextColor};
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

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  // pc
  @media (min-width: 832px) {
    padding: 100px;

    .layout {
      section {
        > div {
          padding: 50px;
        }
      }
    }
  }

  // tablet
  @media (min-width: 512px) and (max-width: 831px) {
    padding: 30px;

    .decimal-point {
      display: none;
    }

    .layout {
      section {
        > div {
          padding: 30px;
        }
      }
    }
  }

  // mobile
  @media (max-width: 511px) {
    padding: 30px 20px;

    .decimal-point {
      display: none;
    }

    .layout {
      section {
        > div {
          padding: 20px;
        }
      }

      .total-deposit {
        .total-deposit-amount {
          font-size: 50px;
        }
      }
    }
  }
`;
