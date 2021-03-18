import {
  AnimateNumber,
  demicrofy,
  formatLunaWithPostfixUnits,
  formatRate,
  formatUSTWithPostfixUnits,
  formatUTokenInteger,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Luna, Rate, UST, uUST } from '@anchor-protocol/types';
import { useConstants } from 'base/contexts/contants';
import { HorizontalScrollTable } from '@terra-dev/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import big, { Big } from 'big.js';
import { screen } from 'env';
import { useBAssetMarket } from 'pages/market-simple/queries/bAssetMarket';
import { useMarket } from 'pages/market-simple/queries/market';
import { useStableCoinMarket } from 'pages/market-simple/queries/stableCoinMarket';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface MarketProps {
  className?: string;
}

function MarketBase({ className }: MarketProps) {
  const { blocksPerYear } = useConstants();

  const {
    data: { uUSD, state },
  } = useMarket();

  const {
    data: { borrowRate, epochState },
  } = useStableCoinMarket({ uUSD, state });

  const {
    data: { ubLuna, oraclePrice },
  } = useBAssetMarket();

  const market = useMemo(() => {
    if (!state || !uUSD) {
      return undefined;
    }

    const { total_liabilities, total_reserves } = state;

    return {
      totalDeposit: big(uUSD)
        .plus(total_liabilities)
        .minus(total_reserves) as uUST<Big>,
      totalBorrow: total_liabilities,
    };
  }, [state, uUSD]);

  const stableCoin = useMemo(() => {
    if (!borrowRate || !epochState) {
      return undefined;
    }

    const depositRate = big(epochState.deposit_rate).mul(
      blocksPerYear,
    ) as Rate<Big>;

    return {
      depositRate,
      borrowRate: big(borrowRate.rate).mul(blocksPerYear) as Rate<Big>,
    };
  }, [blocksPerYear, borrowRate, epochState]);

  const bAsset = useMemo(() => {
    if (!ubLuna || !oraclePrice) {
      return undefined;
    }

    return {
      price: oraclePrice.rate,
      totalCollateral: ubLuna,
      totalCollateralValue: big(oraclePrice.rate).mul(ubLuna) as uUST<Big>,
    };
  }, [oraclePrice, ubLuna]);

  return (
    <div className={className}>
      <main>
        <h1>DASHBOARD</h1>

        <div className="content-layout">
          <Section className="total-deposit">
            <h2>
              <IconSpan>
                TOTAL DEPOSIT{' '}
                <InfoTooltip>
                  Total deposited asset value of Anchor (USD)
                </InfoTooltip>
              </IconSpan>
            </h2>

            <div className="amount">
              ${' '}
              <AnimateNumber format={formatUTokenInteger}>
                {market ? market.totalDeposit : (0 as uUST<number>)}
              </AnimateNumber>
            </div>
          </Section>

          <Section className="total-borrow">
            <h2>
              <IconSpan>
                TOTAL BORROW{' '}
                <InfoTooltip>
                  Total borrowed asset value of Anchor (USD)
                </InfoTooltip>
              </IconSpan>
            </h2>

            <div className="amount">
              ${' '}
              <AnimateNumber format={formatUTokenInteger}>
                {market ? market.totalBorrow : (0 as uUST<number>)}
              </AnimateNumber>
            </div>
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
                  <th>
                    <IconSpan>
                      Total Deposit{' '}
                      <InfoTooltip>
                        Total deposited value of this stablecoin market in USD
                      </InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Deposit APY{' '}
                      <InfoTooltip>
                        Annualized deposit interest of this stablecoin market
                      </InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Total Borrow{' '}
                      <InfoTooltip>
                        Total borrow value of this stable coin market in USD
                      </InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Borrow APR{' '}
                      <InfoTooltip>Annualized borrow interest</InfoTooltip>
                    </IconSpan>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <i>
                        <TokenIcon token="ust" />
                      </i>
                      <div>
                        <div className="coin">UST</div>
                        <p className="name">Terra USD</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber format={formatUTokenInteger}>
                        {market ? market.totalDeposit : (0 as uUST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <AnimateNumber format={formatRate}>
                        {stableCoin
                          ? stableCoin.depositRate
                          : (0 as Rate<number>)}
                      </AnimateNumber>
                      %
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber format={formatUTokenInteger}>
                        {market ? market.totalBorrow : (0 as uUST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      {stableCoin ? formatRate(stableCoin.borrowRate) : 0}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </HorizontalScrollTable>
          </Section>

          <Section className="basset-market">
            <HorizontalScrollTable minWidth={800}>
              <colgroup>
                <col style={{ width: 300 }} />
                <col style={{ width: 300 }} />
                <col style={{ width: 300 }} />
                <col style={{ width: 300 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>bASSET MARKET</th>
                  <th>
                    <IconSpan>
                      Price <InfoTooltip>Oracle price of bAsset</InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Total Collateral{' '}
                      <InfoTooltip>
                        Total collateral value in bASSET
                      </InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Total Collateral Value{' '}
                      <InfoTooltip>Total collateral value in USD</InfoTooltip>
                    </IconSpan>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <i>
                        <TokenIcon token="bluna" />
                      </i>
                      <div>
                        <div className="coin">bLUNA</div>
                        <p className="name">Bonded Luna</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber format={formatUSTWithPostfixUnits}>
                        {bAsset ? bAsset.price : (0 as UST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <AnimateNumber format={formatLunaWithPostfixUnits}>
                        {bAsset
                          ? demicrofy(bAsset.totalCollateral)
                          : (0 as Luna<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber
                        format={formatUSTWithPostfixUnits}
                        id="collateral-value"
                      >
                        {bAsset
                          ? demicrofy(bAsset.totalCollateralValue)
                          : (0 as UST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                </tr>
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

      margin-bottom: 10px;
    }

    .amount {
      font-weight: 200;
      letter-spacing: -1px;
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

          &:first-child > div {
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
  .total-deposit,
  .total-borrow {
    .amount {
      word-break: keep-all;
      white-space: nowrap;
      font-size: 60px;
    }
  }

  // pc
  @media (min-width: ${screen.tablet.max}px) {
    padding: 100px;

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

  // mobile
  @media (max-width: ${screen.tablet.max}px) {
    padding: 30px 20px;

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .total-deposit,
    .total-borrow {
      .amount {
        font-size: 40px;
      }
    }
  }
`;
