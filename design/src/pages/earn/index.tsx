import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { screen } from 'env';
import { useDepositDialog } from './useDepositDialog';
import React from 'react';
import styled from 'styled-components';

export interface EarnProps {
  className?: string;
}

function EarnBase({ className }: EarnProps) {
  const [openDepositDialog, depositDialogElement] = useDepositDialog();

  return (
    <div className={className}>
      <main>
        <h1>EARN</h1>

        <div className="content-layout">
          <Section className="total-deposit">
            <h2>TOTAL DEPOSIT</h2>

            <div className="amount">
              2,320<span className="decimal-point">.063700</span> UST
            </div>

            <div className="amount-description">12,320.063 aUST</div>

            <HorizontalRuler />

            <aside className="total-deposit-buttons">
              <ActionButton onClick={() => openDepositDialog({})}>
                Deposit
              </ActionButton>
              <ActionButton>Withdraw</ActionButton>
            </aside>
          </Section>

          <Section className="interest">
            <h2>INTEREST</h2>

            <div className="apy">
              <div className="value">9.36%</div>
              <p className="name">APY</p>
              <figure></figure>
            </div>

            <HorizontalRuler />

            <article className="earn">
              <ul>
                <li data-selected="true">Total</li>
                <li>Year</li>
                <li>Month</li>
                <li>Week</li>
                <li>Day</li>
              </ul>

              <div className="amount">
                2,320<span className="decimal-point">.063700</span> UST
                <p>Interest earned</p>
              </div>
            </article>
          </Section>

          <Section className="transaction-history">
            <h2>TRANSACTION HISTORY</h2>

            <ul>
              {Array.from({ length: 20 }, (_, i) => (
                <li key={'listitem' + i}>
                  <div className="amount">+200 UST</div>
                  <div className="detail">
                    <span>Deposit from terra1...52wpvt</span>
                    <time>16:53 12 Oct 2020</time>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </main>

      {depositDialogElement}
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
        border-radius: 10px;
        border: 2px dashed white;
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
