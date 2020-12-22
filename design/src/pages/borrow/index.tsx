import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { Error } from '@material-ui/icons';
import { screen } from 'env';
import { useBorrowDialog } from 'pages/borrow/useBorrowDialog';
import React from 'react';
import styled from 'styled-components';

export interface BorrowProps {
  className?: string;
}

function BorrowBase({ className }: BorrowProps) {
  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();

  return (
    <div className={className}>
      <main>
        <h1>BORROW</h1>

        <div className="content-layout">
          <Section className="borrow">
            <article>
              <div>
                <label>APR</label>
                <p>2.60%</p>
              </div>

              <div>
                <label>Collateral Value</label>
                <p>$420,000.00</p>
              </div>

              <div>
                <label>Borrowed Value</label>
                <p>$420,000.00</p>
              </div>
            </article>

            <figure></figure>
          </Section>

          <Section className="collateral-list">
            <h2>COLLATERAL LIST</h2>

            <HorizontalScrollTable>
              <colgroup>
                <col style={{ width: 300 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }, (_, i) => (
                  <tr key={'collateral-list' + i}>
                    <td>
                      <i>
                        <Error />
                      </i>
                      <div>
                        <div className="coin">bLuna</div>
                        <p className="name">Bonded Luna</p>
                      </div>
                    </td>
                    <td>
                      <div className="value">240 UST</div>
                      <p className="volatility">200k bLUNA</p>
                    </td>
                    <td>
                      <ActionButton onClick={() => openBorrowDialog({})}>
                        Add
                      </ActionButton>
                      <ActionButton>Withdraw</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HorizontalScrollTable>
          </Section>

          <Section className="loan-list">
            <h2>LOAN LIST</h2>

            <HorizontalScrollTable>
              <colgroup>
                <col style={{ width: 300 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 300 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>APR / Accrued</th>
                  <th>Borrowed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 2 }, (_, i) => (
                  <tr key={'collateral-list' + i}>
                    <td>
                      <i>
                        <Error />
                      </i>
                      <div>
                        <div className="coin">UST</div>
                        <p className="name">Terra USD</p>
                      </div>
                    </td>
                    <td>
                      <div className="value">3.19%</div>
                      <p className="volatility">200 UST</p>
                    </td>
                    <td>
                      <div className="value">120K UST</div>
                      <p className="volatility">200k USD</p>
                    </td>
                    <td>
                      <ActionButton>Borrow</ActionButton>
                      <ActionButton>Repay</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HorizontalScrollTable>
          </Section>
        </div>
      </main>

      {borrowDialogElement}
    </div>
  );
}

export const Borrow = styled(BorrowBase)`
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

  .borrow {
    article {
      text-align: center;

      label {
        font-size: 14px;
        color: ${({ theme }) => theme.dimTextColor};
      }

      p {
        font-weight: 300;
        font-size: 48px;
      }

      margin-bottom: 65px;
    }

    figure {
      height: 100px;
      border-radius: 20px;
      border: 2px dashed ${({ theme }) => theme.textColor};
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
