import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { mediaQuery } from 'components/layout/mediaQuery';
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

        <div className="content">
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
    </div>
  );
}

export const Title = styled.h1`
  height: 41px;
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

      font-size: 34px;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: ${({ theme }) => theme.textColor};
    }

    hr {
      margin: 30px 0;
    }

    .decimal-point {
      color: ${({ theme }) => theme.dimTextColor};
    }

    .total-deposit {
      .total-deposit-amount {
        font-size: 64px;
        font-weight: 200;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: -3px;
        color: ${({ theme }) => theme.textColor};
      }

      .total-deposit-subamount {
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
  @media (${mediaQuery.pc}) {
    padding: 100px;

    .layout {
      .content {
        section {
          > div {
            padding: 50px;
          }
        }
      }
    }
  }

  @media (${mediaQuery.pcSmall}) {
    .layout {
      .content {
        section {
          margin-bottom: 40px;
        }
      }
    }
  }

  @media (${mediaQuery.pcHuge}) {
    .layout {
      max-width: 1440px;
      margin: 0 auto;

      .content {
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
  }

  // tablet
  @media (${mediaQuery.tablet}) {
    padding: 30px;

    .decimal-point {
      display: none;
    }

    .layout {
      .content {
        section {
          margin-bottom: 40px;

          > div {
            padding: 30px;
          }
        }
      }
    }
  }

  // mobile
  @media (${mediaQuery.mobile}) {
    padding: 30px 20px;

    .decimal-point {
      display: none;
    }

    .layout {
      .content {
        section {
          margin-bottom: 40px;

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
  }
`;
