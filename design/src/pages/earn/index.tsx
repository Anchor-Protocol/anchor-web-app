import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { screen } from 'env';
import React from 'react';
import styled from 'styled-components';

export interface EarnProps {
  className?: string;
}

function EarnBase({ className }: EarnProps) {
  return (
    <div className={className}>
      <main>
        <h1>EARN</h1>

        <div className="content-layout">
          <Section className="total-deposit">
            <h2>TOTAL DEPOSIT</h2>

            <figure className="amount">
              2,320<span className="decimal-point">.063700</span> UST
            </figure>

            <figure className="amount-description">12,320.063 aUST</figure>

            <HorizontalRuler />

            <aside className="total-deposit-buttons">
              <ActionButton>Deposit</ActionButton>
              <ActionButton>Withdraw</ActionButton>
            </aside>
          </Section>

          <Section className="interest">
            <h2>INTEREST</h2>

            <figure className="apy">
              936%
              <p>APY</p>
            </figure>

            <HorizontalRuler />

            <article className="earn">
              <ul>
                <li>Total</li>
                <li>Year</li>
                <li>Month</li>
                <li>Week</li>
                <li>Day</li>
              </ul>

              <figure className="amount">
                2,320<span className="decimal-point">.063700</span> UST
                <p>Interest earned</p>
              </figure>
            </article>
          </Section>

          <Section className="transaction-history">
            <h2>TRANSACTION HISTORY</h2>

            <ul>
              {Array.from({ length: 20 }, (_, i) => (
                <li key={'listitem' + i}>
                  <figure>+200 UST</figure>
                  <div>
                    <span>Deposit from terra1...52wpvt</span>
                    <span>16:53 12 Oct 2020</span>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </div>
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
    color: #ffffff;
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
  }

  .transaction-history {
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

  .transaction-history {
    h2 {
      margin-bottom: 20px;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 20px 0;

        figure {
          font-size: 18px;
          color: ${({ theme }) => theme.textColor};
        }

        div {
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

    .decimal-point {
      display: none;
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

    .decimal-point {
      display: none;
    }

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
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
