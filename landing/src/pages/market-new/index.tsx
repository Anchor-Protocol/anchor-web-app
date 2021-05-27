import {
  AnimateNumber,
  demicrofy,
  formatLunaWithPostfixUnits,
  formatRate,
  formatUST,
  formatUSTWithPostfixUnits,
  formatUTokenInteger,
  formatUTokenIntegerWithoutPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Luna, Rate, UST, uUST } from '@anchor-protocol/types';
import { HorizontalScrollTable } from '@terra-dev/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import {
  horizontalRuler,
  pressed,
  verticalRuler,
} from '@terra-dev/styled-neumorphism';
import { Footer } from 'base/components/Footer';
import { useConstants } from 'base/contexts/contants';
import big, { Big } from 'big.js';
import { screen } from 'env';
import React, { useMemo } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { ANCPriceChart } from './components/ANCPriceChart';
import { CollateralsChart } from './components/CollateralsChart';
import { StablecoinChart } from './components/StablecoinChart';
import { TotalValueLockedDoughnutChart } from './components/TotalValueLockedDoughnutChart';
import { useMarketANCPriceHistory } from './queries/marketANCPriceHistory';
import { useMarketBluna } from './queries/marketBluna';
import { useMarketBorrow } from './queries/marketBorrow';
import { useMarketCollaterals } from './queries/marketCollateral';
import { useMarketDeposit } from './queries/marketDeposit';
import { useMarketUST } from './queries/marketUST';

export interface MarketProps {
  className?: string;
}

function MarketBase({ className }: MarketProps) {
  const theme = useTheme();

  const { blocksPerYear } = useConstants();

  const { data: marketDeposit } = useMarketDeposit();
  const { data: marketBorrow } = useMarketBorrow();
  const { data: marketCollaterals } = useMarketCollaterals();
  const { data: marketUST } = useMarketUST();
  const { data: marketBluna } = useMarketBluna();

  const { data: marketANCPriceHistory } = useMarketANCPriceHistory();

  const totalValueLocked = useMemo(() => {
    if (!marketDeposit || !marketCollaterals || !marketUST) {
      return undefined;
    }

    return {
      totalDeposit: marketDeposit.total_ust_deposits,
      totalCollaterals: marketCollaterals.total_value,
      totalValueLocked: big(marketDeposit.total_ust_deposits).plus(
        marketCollaterals.total_value,
      ) as uUST<Big>,
      yieldReserve: marketUST.overseer_ust_balance,
    };
  }, [marketCollaterals, marketDeposit, marketUST]);

  const ancPrice = useMemo(() => {
    if (!marketANCPriceHistory || marketANCPriceHistory.length === 0) {
      return undefined;
    }

    const last = marketANCPriceHistory[marketANCPriceHistory.length - 1];
    const last1DayBefore =
      marketANCPriceHistory[marketANCPriceHistory.length - 2];

    return {
      updown: big(big(last.anc_price).minus(last1DayBefore.anc_price)).div(
        last1DayBefore.anc_price,
      ) as Rate<Big>,
      ancPrice: last.anc_price,
      circulatingSupply: last.anc_circulating_supply,
      ancMarketCap: '100000' as uUST,
    };
  }, [marketANCPriceHistory]);

  const stableCoin = useMemo(() => {
    if (!marketDeposit || !marketBorrow || !marketUST) {
      return undefined;
    }

    return {
      totalDeposit: marketDeposit.total_ust_deposits,
      totalBorrow: marketBorrow.total_borrowed,
      totalDepositGraph: 'TODO: API not ready...',
      totalBorrowGraph: 'TODO: API not ready...',
      totalDepositDiff: 'TODO: API not ready...',
      totalBorrowDiff: 'TODO: API not ready...',
      depositAPR: big(marketUST.deposit_rate).mul(blocksPerYear) as Rate<Big>,
      depositAPRDiff: 'TODO: API not ready...',
      borrowAPR: big(marketUST.borrow_rate).mul(blocksPerYear) as Rate<Big>,
      borrowAPRDiff: 'TODO: API not ready...',
    };
  }, [blocksPerYear, marketBorrow, marketDeposit, marketUST]);

  const collaterals = useMemo(() => {
    if (!marketCollaterals || !marketBluna) {
      return undefined;
    }

    return {
      mainTotalCollateralValue: marketCollaterals.total_value,
      totalCollateralValueGraph: 'TODO: API not ready...',
      blunaPrice: marketBluna.bLuna_price,
      blunaPriceDiff: 'TODO: API not ready...',
      totalCollateral: marketCollaterals.collaterals.find(
        ({ bluna }) => !!bluna,
      )?.bluna,
      totalCollateralDiff: 'TODO: API not ready...',
      totalCollateralValue: big(
        marketCollaterals.collaterals.find(({ bluna }) => !!bluna)?.bluna ?? 1,
      ).mul(marketBluna.bLuna_price) as uUST<Big>,
      totalCollateralValueDiff: 'TODO: API not ready...',
    };
  }, [marketBluna, marketCollaterals]);

  return (
    <div className={className}>
      <main>
        <div className="content-layout">
          <h1>DASHBOARD</h1>

          <div className="summary-section">
            <Section className="total-value-locked">
              <section>
                <h2>TOTAL VALUE LOCKED</h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {totalValueLocked
                      ? totalValueLocked.totalValueLocked
                      : (0 as uUST<number>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
                <figure>
                  <div className="chart">
                    <TotalValueLockedDoughnutChart
                      totalDeposit={
                        totalValueLocked?.totalDeposit ?? ('0' as uUST)
                      }
                      totalCollaterals={
                        totalValueLocked?.totalCollaterals ?? ('1' as uUST)
                      }
                      totalDepositColor={theme.colors.positive}
                      totalCollateralsColor={theme.textColor}
                    />
                  </div>
                  <div>
                    <h3>
                      <i style={{ backgroundColor: theme.colors.positive }} />{' '}
                      Total Deposit
                    </h3>
                    <p>
                      ${' '}
                      <AnimateNumber
                        format={formatUTokenIntegerWithoutPostfixUnits}
                      >
                        {totalValueLocked
                          ? totalValueLocked.totalDeposit
                          : (0 as uUST<number>)}
                      </AnimateNumber>
                    </p>
                    <h3>
                      <i style={{ backgroundColor: theme.textColor }} /> Total
                      Collateral
                    </h3>
                    <p>
                      ${' '}
                      <AnimateNumber
                        format={formatUTokenIntegerWithoutPostfixUnits}
                      >
                        {totalValueLocked
                          ? totalValueLocked.totalCollaterals
                          : (0 as uUST<number>)}
                      </AnimateNumber>
                    </p>
                  </div>
                </figure>
              </section>

              <hr />

              <section>
                <h2>YIELD RESERVE</h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {totalValueLocked
                      ? totalValueLocked.yieldReserve
                      : (0 as uUST<number>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
              </section>
            </Section>

            <Section className="anc-price">
              <header>
                <div>
                  <h2>
                    ANC PRICE
                    {ancPrice && (
                      <span>
                        {big(ancPrice.updown).gte(0) ? '+' : '-'}
                        {formatRate(ancPrice.updown)}%
                      </span>
                    )}
                  </h2>
                  <p className="amount">
                    {ancPrice ? formatUST(ancPrice.ancPrice) : 0}
                    <span>UST</span>
                  </p>
                </div>
                <div>
                  <h3>Circulating Supply</h3>
                  <p>
                    {ancPrice
                      ? formatUTokenIntegerWithoutPostfixUnits(
                          ancPrice.circulatingSupply,
                        )
                      : 0}
                    <span>ANC</span>
                  </p>
                </div>
                <div>
                  <h3>ANC Market Cap</h3>
                  <p>
                    <s>
                      250,840,183<span>UST</span>
                    </s>
                  </p>
                </div>
              </header>
              <figure>
                <div>
                  <ANCPriceChart data={marketANCPriceHistory} />
                </div>
              </figure>
            </Section>

            <Section className="anc-buyback">
              <section>
                <h2>ANC BUYBACK (24HR)</h2>
                <div>
                  <p>
                    <s>
                      815<span>ANC</span>
                    </s>
                  </p>
                  <p>
                    <s>
                      12,249<span>UST</span>
                    </s>
                  </p>
                </div>
              </section>
              <hr />
              <section>
                <h2>ANC BUYBACK (TOTAL)</h2>
                <div>
                  <p>
                    <s>
                      12,947<span>ANC</span>
                    </s>
                  </p>
                  <p>
                    <s>
                      194,383<span>UST</span>
                    </s>
                  </p>
                </div>
              </section>
            </Section>
          </div>

          <Section className="stablecoin">
            <header>
              <div>
                <h2>
                  TOTAL DEPOSIT
                  <span>
                    <s>+2.32%</s>
                  </span>
                </h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {stableCoin ? stableCoin.totalDeposit : (0 as uUST<number>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
              </div>
              <div>
                <h2>
                  TOTAL BORROW
                  <span>
                    <s>-0.32%</s>
                  </span>
                </h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {stableCoin ? stableCoin.totalBorrow : (0 as uUST<number>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
              </div>
              <div />
            </header>

            <figure>
              <div>
                <StablecoinChart />
              </div>
            </figure>

            <HorizontalScrollTable minWidth={900} className="stablecoin-market">
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
                        {stableCoin
                          ? stableCoin.totalDeposit
                          : (0 as uUST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <s>
                        <AnimateNumber format={formatRate}>
                          {18.23 as Rate<number>}
                        </AnimateNumber>
                        <span>%</span>
                      </s>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber format={formatUTokenInteger}>
                        {stableCoin
                          ? stableCoin.totalBorrow
                          : (0 as uUST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <s>{0}%</s>
                    </div>
                  </td>
                </tr>
              </tbody>
            </HorizontalScrollTable>
          </Section>

          <Section className="collaterals">
            <header>
              <div>
                <h2>
                  TOTAL COLLATERAL VALUE
                  <span>
                    <s>+ 2.32%</s>
                  </span>
                </h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {collaterals
                      ? collaterals.mainTotalCollateralValue
                      : (0 as uUST<number>)}
                  </AnimateNumber>
                  <span> UST</span>
                </p>
              </div>
            </header>

            <figure>
              <div>
                <CollateralsChart />
              </div>
            </figure>

            <HorizontalScrollTable minWidth={800} className="basset-market">
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
                      <AnimateNumber format={formatUST}>
                        {collaterals
                          ? collaterals.blunaPrice
                          : (0 as UST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <AnimateNumber format={formatLunaWithPostfixUnits}>
                        {collaterals?.totalCollateral
                          ? demicrofy(collaterals.totalCollateral)
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
                        {collaterals
                          ? demicrofy(collaterals.totalCollateralValue)
                          : (0 as UST<number>)}
                      </AnimateNumber>
                    </div>
                  </td>
                </tr>
              </tbody>
            </HorizontalScrollTable>
          </Section>
        </div>

        <Footer style={{ margin: '60px 0' }} />
      </main>
    </div>
  );
}

const hHeavyRuler = css`
  padding: 0;
  margin: 0;

  border: 0;

  height: 5px;
  border-radius: 3px;

  ${({ theme }) =>
    pressed({
      color: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};
`;

const hRuler = css`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.backgroundColor,
      intensity: theme.intensity,
    })};
`;

const vRuler = css`
  ${({ theme }) =>
    verticalRuler({
      color: theme.backgroundColor,
      intensity: theme.intensity,
    })};
`;

export const Market = styled(MarketBase)`
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h1 {
    margin: 0 0 50px 0;

    font-size: 44px;
    font-weight: 900;
    color: ${({ theme }) => theme.textColor};
  }

  h2 {
    font-size: 13px;
    font-weight: 700;

    margin-bottom: 8px;

    span {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 22px;
      margin-left: 10px;
      background-color: ${({ theme }) => theme.colors.positive};
      color: ${({ theme }) => theme.highlightBackgroundColor};
    }
  }

  h3 {
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.dimTextColor};
  }

  // TODO remove
  pre {
    font-size: 13px;
    overflow: hidden;
  }

  .amount {
    font-size: 36px;
    font-weight: 700;

    span:last-child {
      margin-left: 8px;
      font-size: 20px;
    }
  }

  .total-value-locked {
    figure {
      margin-top: 39px;

      display: flex;
      align-items: center;

      > .chart {
        width: 152px;
        height: 152px;

        margin-right: 44px;
      }

      > div {
        h3 {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 3px;
            margin-right: 3px;
          }

          margin-bottom: 8px;
        }

        p {
          font-size: 18px;

          &:nth-of-type(1) {
            margin-bottom: 27px;
          }
        }
      }
    }
  }

  .anc-price {
    header {
      display: flex;
      align-items: center;

      > div:first-child {
        flex: 1;
      }

      > div:not(:first-child) {
        h3 {
          margin-bottom: 10px;
        }

        p {
          font-size: 18px;

          span:last-child {
            margin-left: 5px;
            font-size: 12px;
          }
        }

        &:last-child {
          margin-left: 30px;
        }
      }

      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .anc-buyback > .NeuSection-content {
    display: flex;
    justify-content: space-between;

    max-width: 1000px;

    padding: 40px 60px;

    hr {
      ${vRuler};
    }

    section {
      div {
        display: flex;

        p {
          display: inline-block;

          font-size: 27px;
          font-weight: 700;

          word-break: keep-all;
          white-space: nowrap;

          span {
            font-size: 18px;
            margin-left: 5px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }

  .stablecoin {
    header {
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .collaterals {
    header {
      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .stablecoin-market,
  .basset-market {
    margin-top: 40px;

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
  main {
    .content-layout {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0;
    }
  }

  // pc
  padding: 50px 100px 100px 100px;

  .NeuSection-root {
    margin-bottom: 40px;
  }

  // align section contents to origin
  @media (min-width: 1400px) {
    .summary-section {
      grid-gap: 40px;
      margin-bottom: 40px;

      .NeuSection-root {
        margin-bottom: 0;
      }

      height: 586px;

      display: grid;
      grid-template-columns: 500px 1fr 1fr;
      grid-template-rows: repeat(5, 1fr);

      .total-value-locked {
        grid-column: 1/2;
        grid-row: 1/6;

        hr {
          ${hHeavyRuler};
          margin-top: 80px;
          margin-bottom: 40px;
        }
      }

      .anc-price {
        grid-column: 2/4;
        grid-row: 1/5;
      }

      .anc-buyback {
        grid-column: 2/4;
        grid-row: 5/6;
      }
    }
  }

  // align section contents to horizontal
  @media (min-width: 900px) and (max-width: 1399px) {
    .summary-section {
      .total-value-locked > .NeuSection-content {
        max-width: 700px;
        display: flex;
        justify-content: space-between;

        hr {
          ${vRuler};
          margin-left: 40px;
          margin-right: 40px;
        }
      }
    }
  }

  // under tablet
  // align section contents to horizontal
  @media (max-width: 899px) {
    padding: 20px 30px 30px 30px;

    h1 {
      margin-bottom: 20px;
    }

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 30px;
      }
    }

    .summary-section {
      .total-value-locked {
        display: block;

        hr {
          ${hHeavyRuler};
          margin-top: 30px;
          margin-bottom: 30px;
        }
      }

      .anc-price {
        header {
          display: block;

          > div:first-child {
            margin-bottom: 10px;
          }

          > div:not(:first-child) {
            display: grid;
            grid-template-columns: 160px 1fr;
            grid-template-rows: 28px;
            align-items: center;

            h3 {
              margin: 0;
            }

            p {
              font-size: 18px;

              span:last-child {
                margin-left: 5px;
                font-size: 12px;
              }
            }

            &:first-child {
              flex: 1;

              p {
                font-size: 36px;
                font-weight: 700;

                span {
                  font-size: 20px;
                }
              }
            }

            &:last-child {
              margin-left: 0;
            }
          }

          margin-bottom: 15px;
        }
      }

      .anc-buyback > .NeuSection-content {
        display: block;

        section {
          div {
            display: block;

            p {
              display: block;
            }
          }
        }

        hr {
          ${hRuler};
          margin: 15px 0;
        }
      }
    }

    .stablecoin {
      header {
        grid-template-columns: repeat(2, 1fr);

        > div:empty {
          display: none;
        }
      }
    }
  }

  // under mobile
  // align section contents to vertical
  @media (max-width: ${screen.mobile.max}px) {
    padding: 10px 20px 30px 20px;

    h1 {
      margin-bottom: 10px;
    }

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .summary-section {
      .total-value-locked {
        figure {
          > .chart {
            width: 120px;
            height: 120px;

            margin-right: 30px;
          }

          > div {
            p:nth-of-type(1) {
              margin-bottom: 12px;
            }
          }
        }
      }
    }

    .stablecoin {
      header {
        display: block;

        > div:first-child {
          margin-bottom: 15px;
        }

        > div:empty {
          display: none;
        }
      }
    }
  }
`;
