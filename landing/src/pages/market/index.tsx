import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TokenIcon, tokens, Tokens } from '@anchor-protocol/token-icons';
import { screen } from 'env';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface MarketProps {
  className?: string;
}

function MarketBase({ className }: MarketProps) {
  return (
    <div className={className}>
      <main>
        <h1>MARKET</h1>

        <div className="content-layout">
          <Section className="total-deposit">
            <h2>
              TOTAL DEPOSIT <span>+12.89%</span>
            </h2>

            <div className="amount">$ 384,238,213</div>

            <HorizontalRuler />

            <article className="summary">
              <div>
                <h4>24hr Deposit Volume</h4>
                <p>$ 384,238</p>
              </div>
              <div>
                <h4># of Depositors</h4>
                <p>1,238,213</p>
              </div>
            </article>
          </Section>

          <Section className="total-borrow">
            <h2>
              TOTAL BORROW <span>-8.90%</span>
            </h2>

            <div className="amount">$ 384,238,213</div>

            <HorizontalRuler />

            <article className="summary">
              <div>
                <h4>24hr Borrow Volume</h4>
                <p>$ 384,238</p>
              </div>
              <div>
                <h4># of Borrows</h4>
                <p>1,238,213</p>
              </div>
            </article>
          </Section>

          <Section className="stablecoin-market">
            <HorizontalScrollTable minWidth={1000}>
              <colgroup>
                <col style={{ width: 300 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>STABLECOIN MARKET</th>
                  <th>Total Deposit</th>
                  <th>Deposit APY</th>
                  <th>Total Borrow</th>
                  <th>Borrow APR</th>
                </tr>
              </thead>
              <tbody>
                {['UST', 'KRT'].map((stableCoinId: string) => (
                  <tr key={'stablecoin-market' + stableCoinId}>
                    <td>
                      <Link to={`/stablecoins/${stableCoinId}`}>
                        <i>
                          <TokenIcon
                            token={stableCoinId.toLowerCase() as Tokens}
                          />
                        </i>
                        <div>
                          <div className="coin">{stableCoinId}</div>
                          <p className="name">Terra USD</p>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <div className="value">$ 233.56M</div>
                      <p className="volatility">+1.89%</p>
                    </td>
                    <td>
                      <div className="value">8.15%</div>
                      <p className="volatility">-0.02</p>
                    </td>
                    <td>
                      <div className="value">$ 76.56M</div>
                      <p className="volatility">+0.21%</p>
                    </td>
                    <td>
                      <div className="value">12.45%</div>
                      <p className="volatility">+0.42</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HorizontalScrollTable>
          </Section>

          <Section className="basset-market">
            <HorizontalScrollTable minWidth={800}>
              <colgroup>
                <col style={{ width: 300 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>bASSET MARKET</th>
                  <th>Price</th>
                  <th>Total Loan</th>
                  <th>Total Collateral</th>
                </tr>
              </thead>
              <tbody>
                {['bLuna', 'bDOT', 'bATOM'].map((bAssetId: string) => (
                  <tr key={'basset-market' + bAssetId}>
                    <td>
                      <Link to={`/bassets/${bAssetId}`}>
                        <i>
                          <TokenIcon
                            token={
                              tokens.indexOf(bAssetId.toLowerCase() as Tokens) >
                              -1
                                ? (bAssetId.toLowerCase() as Tokens)
                                : 'aust'
                            }
                            variant="@2x"
                          />
                        </i>
                        <div>
                          <div className="coin">{bAssetId}</div>
                          <p className="name">Bonded Luna</p>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <div className="value">$ 233.56M</div>
                      <p className="volatility">+1.89%</p>
                    </td>
                    <td>
                      <div className="value">8.15%</div>
                      <p className="volatility">-0.02</p>
                    </td>
                    <td>
                      <div className="value">$ 76.56M</div>
                      <p className="volatility">+0.21%</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </HorizontalScrollTable>
          </Section>
        </div>
      </main>
    </div>
  );
}

export const Market = styled(MarketBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h1 {
    margin: 0 0 50px 0;

    font-size: 44px;
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

  .total-deposit,
  .total-borrow {
    h2 {
      display: flex;
      align-items: center;

      span {
        margin-left: 12px;
        display: inline-block;
        padding: 4px 8px;
        background-color: #e95979;
        border-radius: 12px;
        color: #ffffff;
        font-size: 11px;
      }

      margin-bottom: 10px;
    }

    .amount {
      font-size: 60px;
      font-weight: 200;
      letter-spacing: -1px;
    }

    .summary {
      display: flex;

      div {
        flex: 1;

        h4 {
          color: ${({ theme }) => theme.dimTextColor};
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 5px;
        }

        p {
          font-size: 18px;
        }

        &:last-child {
          text-align: right;
        }
      }
    }
  }

  .stablecoin-market,
  .basset-market {
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
        tr {
          &:hover {
            background-color: rgba(37, 117, 164, 0.05);
          }
        }

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

          &:first-child > a {
            text-decoration: none;
            color: currentColor;

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
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
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

        grid-template-columns: 1fr 1fr;
        grid-gap: 40px;

        .total-deposit {
          grid-column: 1/2;
        }

        .total-borrow {
          grid-column: 2;
        }

        .stablecoin-market {
          grid-column: 1/3;
        }

        .basset-market {
          grid-column: 1/3;
        }
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
  }
`;
