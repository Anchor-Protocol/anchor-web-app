import {
  formatUST,
  formatUTokenInteger,
  formatUTokenIntegerWithoutPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Rate, u, UST } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
  useMarketAncQuery,
  useMarketBuybackQuery,
  useMarketCollateralsQuery,
  useMarketDepositAndBorrowQuery,
  useMarketStableCoinQuery,
  useMarketUstQuery,
} from '@anchor-protocol/app-provider';
import { formatRate } from '@libs/formatter';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import {
  horizontalRuler,
  pressed,
  verticalRuler,
} from '@libs/styled-neumorphism';
import { AnimateNumber } from '@libs/ui';
import big, { Big } from 'big.js';
import { Footer } from 'components/Footer';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { ANCPriceChart } from './components/ANCPriceChart';
import { findPrevDay } from './components/internal/axisUtils';
import { StablecoinChart } from './components/StablecoinChart';
import { TotalValueLockedDoughnutChart } from './components/TotalValueLockedDoughnutChart';
import { CollateralMarket } from './components/CollateralMarket';
import { useRewards } from 'pages/mypage/logics/useRewards';

export interface DashboardProps {
  className?: string;
}

const EMPTY_ARRAY: any[] = [];

function DashboardBase({ className }: DashboardProps) {
  const theme = useTheme();

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    function handler() {
      setIsMobile(window.innerWidth < 500);
    }

    window.addEventListener('resize', handler);
    handler();

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { data: { borrowRate, epochState } = {} } = useMarketStableCoinQuery();

  const stableCoinLegacy = useMemo(() => {
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

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();
  const { data: marketUST } = useMarketUstQuery();
  const { data: marketANC } = useMarketAncQuery();
  const { data: marketDepositAndBorrow } = useMarketDepositAndBorrowQuery();
  const { data: marketCollaterals } = useMarketCollateralsQuery();
  const { data: marketBuybackTotal } = useMarketBuybackQuery('total');
  const { data: marketBuyback72hrs } = useMarketBuybackQuery('72hrs');

  const totalValueLocked = useMemo(() => {
    if (!marketDepositAndBorrow?.now || !marketCollaterals?.now || !marketUST) {
      return undefined;
    }

    return {
      totalDeposit: marketDepositAndBorrow?.now.total_ust_deposits,
      totalCollaterals: marketCollaterals?.now.total_value,
      totalValueLocked: big(
        marketDepositAndBorrow?.now.total_ust_deposits,
      ).plus(marketCollaterals?.now.total_value) as u<UST<Big>>,
      yieldReserve: marketUST.overseer_ust_balance,
    };
  }, [marketCollaterals?.now, marketDepositAndBorrow?.now, marketUST]);

  const { ancPrice: ancPriceUST } = useRewards();

  const ancPrice = useMemo(() => {
    if (!marketANC || marketANC.history.length === 0) {
      return undefined;
    }

    const last = marketANC.now;
    const lastPrice = ancPriceUST?.ANCPrice ?? last.anc_price;
    const last1DayBefore =
      marketANC.history.find(findPrevDay(last.timestamp)) ??
      marketANC.history[marketANC.history.length - 2] ??
      marketANC.history[marketANC.history.length - 1];

    return {
      ancPriceDiff: big(big(lastPrice).minus(last1DayBefore.anc_price)).div(
        last1DayBefore.anc_price,
      ) as Rate<Big>,
      ancPrice: lastPrice,
      circulatingSupply: last.anc_circulating_supply,
      ancMarketCap: big(lastPrice).mul(last.anc_circulating_supply) as u<
        UST<Big>
      >,
    };
  }, [marketANC, ancPriceUST]);

  const stableCoin = useMemo(() => {
    if (
      !marketUST ||
      !marketDepositAndBorrow ||
      marketDepositAndBorrow.history.length === 0
    ) {
      return undefined;
    }

    const last = marketDepositAndBorrow.now;
    const last1DayBefore =
      marketDepositAndBorrow.history.find(findPrevDay(last.timestamp)) ??
      marketDepositAndBorrow.history[marketDepositAndBorrow.history.length - 2];

    return {
      totalDeposit: last.total_ust_deposits,
      totalBorrow: last.total_borrowed,
      totalDepositDiff: big(
        big(last.total_ust_deposits).minus(last1DayBefore.total_ust_deposits),
      ).div(last1DayBefore.total_ust_deposits) as Rate<Big>,
      totalBorrowDiff: big(
        big(last.total_borrowed).minus(last1DayBefore.total_borrowed),
      ).div(last1DayBefore.total_borrowed) as Rate<Big>,
      depositAPR: big(marketUST.deposit_rate).mul(blocksPerYear) as Rate<Big>,
      depositAPRDiff: 'TODO: API not ready...',
      borrowAPR: big(marketUST.borrow_rate).mul(blocksPerYear) as Rate<Big>,
      borrowAPRDiff: 'TODO: API not ready...',
    };
  }, [blocksPerYear, marketDepositAndBorrow, marketUST]);

  return (
    <div className={className}>
      <main>
        <div className="content-layout">
          <TitleContainerAndExchangeRate>
            <PageTitle title="DASHBOARD" />
            {moneyMarketEpochState && (
              <div>
                1 <small>aUST</small> <TokenIcon token="aust" />{' '}
                <small>≈</small>{' '}
                {formatUST(moneyMarketEpochState.exchange_rate)}{' '}
                <small>UST</small> <TokenIcon token="ust" />
              </div>
            )}
          </TitleContainerAndExchangeRate>

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
                      : (0 as u<UST<number>>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
                <figure>
                  <div className="chart">
                    <TotalValueLockedDoughnutChart
                      totalDeposit={
                        totalValueLocked?.totalDeposit ?? ('0' as u<UST>)
                      }
                      totalCollaterals={
                        totalValueLocked?.totalCollaterals ?? ('1' as u<UST>)
                      }
                      totalDepositColor={theme.colors.secondary}
                      totalCollateralsColor={theme.textColor}
                    />
                  </div>
                  <div>
                    <h3>
                      <i style={{ backgroundColor: theme.colors.secondary }} />{' '}
                      Total Deposit
                    </h3>
                    <p>
                      ${' '}
                      <AnimateNumber
                        format={formatUTokenIntegerWithoutPostfixUnits}
                      >
                        {totalValueLocked
                          ? totalValueLocked.totalDeposit
                          : (0 as u<UST<number>>)}
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
                          : (0 as u<UST<number>>)}
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
                      : (0 as u<UST<number>>)}
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
                      <span data-negative={big(ancPrice.ancPriceDiff).lt(0)}>
                        {big(ancPrice.ancPriceDiff).gte(0) ? '+' : ''}
                        {formatRate(ancPrice.ancPriceDiff)}%
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
                    {ancPrice
                      ? formatUTokenIntegerWithoutPostfixUnits(
                          ancPrice.ancMarketCap,
                        )
                      : 0}
                    <span>UST</span>
                  </p>
                </div>
              </header>
              <figure>
                <div>
                  <ANCPriceChart
                    data={marketANC?.history ?? EMPTY_ARRAY}
                    theme={theme}
                    isMobile={isMobile}
                  />
                </div>
              </figure>
            </Section>

            <Section className="anc-buyback">
              <section>
                <h2>ANC BUYBACK (72HR)</h2>
                <div>
                  <p>
                    {marketBuyback72hrs
                      ? formatUTokenIntegerWithoutPostfixUnits(
                          marketBuyback72hrs.buyback_amount,
                        )
                      : 0}
                    <span>ANC</span>
                  </p>
                  <p>
                    {marketBuyback72hrs
                      ? formatUTokenIntegerWithoutPostfixUnits(
                          marketBuyback72hrs.offer_amount,
                        )
                      : 0}
                    <span>UST</span>
                  </p>
                </div>
              </section>
              <hr />
              <section>
                <h2>ANC BUYBACK (TOTAL)</h2>
                <div>
                  <p>
                    {marketBuybackTotal
                      ? formatUTokenIntegerWithoutPostfixUnits(
                          marketBuybackTotal.buyback_amount,
                        )
                      : 0}
                    <span>ANC</span>
                  </p>
                  <p>
                    {marketBuybackTotal
                      ? formatUTokenIntegerWithoutPostfixUnits(
                          marketBuybackTotal.offer_amount,
                        )
                      : 0}
                    <span>UST</span>
                  </p>
                </div>
              </section>
            </Section>
          </div>

          <Section className="stablecoin">
            <header>
              <div>
                <h2>
                  <i style={{ backgroundColor: theme.colors.secondary }} />{' '}
                  TOTAL DEPOSIT
                  {stableCoin && (
                    <span
                      data-negative={big(stableCoin.totalDepositDiff).lt(0)}
                    >
                      {big(stableCoin.totalDepositDiff).gte(0) ? '+' : ''}
                      {formatRate(stableCoin.totalDepositDiff)}%
                    </span>
                  )}
                </h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {stableCoin
                      ? stableCoin.totalDeposit
                      : (0 as u<UST<number>>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
              </div>
              <div>
                <h2>
                  <i style={{ backgroundColor: theme.textColor }} /> TOTAL
                  BORROW
                  {stableCoin && (
                    <span data-negative={big(stableCoin.totalBorrowDiff).lt(0)}>
                      {big(stableCoin.totalBorrowDiff).gte(0) ? '+' : ''}
                      {formatRate(stableCoin.totalBorrowDiff)}%
                    </span>
                  )}
                </h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {stableCoin
                      ? stableCoin.totalBorrow
                      : (0 as u<UST<number>>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
              </div>
              <div />
            </header>

            <figure>
              <div>
                <StablecoinChart
                  data={marketDepositAndBorrow?.history ?? EMPTY_ARRAY}
                  theme={theme}
                  isMobile={isMobile}
                />
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
                          : (0 as u<UST<number>>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <AnimateNumber format={formatRate}>
                        {stableCoinLegacy
                          ? stableCoinLegacy.depositRate
                          : (0 as Rate<number>)}
                      </AnimateNumber>
                      <span>%</span>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber format={formatUTokenInteger}>
                        {stableCoin
                          ? stableCoin.totalBorrow
                          : (0 as u<UST<number>>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <AnimateNumber format={formatRate}>
                        {stableCoinLegacy
                          ? stableCoinLegacy.borrowRate
                          : (0 as Rate<number>)}
                      </AnimateNumber>
                      <span>%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </HorizontalScrollTable>
          </Section>

          <CollateralMarket className="collaterals" />
        </div>

        <Footer style={{ margin: '60px 0' }} />
      </main>
    </div>
  );
}

const TitleContainerAndExchangeRate = styled(TitleContainer)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  > :nth-child(2) {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.03em;

    small {
      font-size: 0.8em;
    }

    img {
      transform: scale(1.2) translateY(0.1em);
    }
  }

  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    > :nth-child(2) {
      font-size: 18px;
    }
  }
`;

const hHeavyRuler = css`
  padding: 0;
  margin: 0;

  border: 0;

  height: 5px;
  border-radius: 3px;

  ${({ theme }) =>
    pressed({
      color: theme.sectionBackgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};
`;

const hRuler = css`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const vRuler = css`
  ${({ theme }) =>
    verticalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const StyledDashboard = styled(DashboardBase)`
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h2 {
    font-size: 12px;
    font-weight: 500;

    margin-bottom: 8px;

    span {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 22px;
      margin-left: 10px;
      background-color: ${({ theme }) => theme.colors.positive};
      color: ${({ theme }) => theme.highlightBackgroundColor};

      &[data-negative='true'] {
        background-color: ${({ theme }) => theme.colors.negative};
      }
    }
  }

  h3 {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
  }

  .amount {
    font-size: 32px;
    font-weight: 500;

    span:last-child {
      margin-left: 8px;
      font-size: 0.555555555555556em;
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
          font-weight: 500;

          word-break: keep-all;
          white-space: nowrap;

          span {
            font-size: 0.666666666666667em;
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

      h2 {
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          margin-right: 3px;
          transform: translateY(1px);
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
            font-size: 16px;
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
  @media (min-width: 940px) and (max-width: 1399px) {
    .summary-section {
      .total-value-locked > .NeuSection-content {
        max-width: 840px;
        display: flex;
        justify-content: space-between;

        hr {
          ${vRuler};
          margin-left: 40px;
          margin-right: 40px;
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

  // under tablet
  // align section contents to horizontal
  @media (max-width: 939px) {
    padding: 20px 30px 30px 30px;

    h1 {
      margin-bottom: 20px;
    }

    h2 {
      span {
        padding: 3px 7px;
      }
    }

    .amount {
      font-size: 28px;
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

        figure {
          > div {
            p {
              font-size: 16px;
            }
          }
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
              font-size: 16px;

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

              font-size: 20px;

              margin-top: 0.5em;
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
        display: block;

        > div:first-child {
          margin-bottom: 15px;
        }

        > div:empty {
          display: none;
        }
      }
    }

    .stablecoin-market,
    .basset-market {
      table {
        tbody {
          td {
            .value,
            .coin {
              font-size: 15px;
            }

            .volatility,
            .name {
              font-size: 12px;
            }

            &:first-child > div {
              i {
                width: 50px;
                height: 50px;

                margin-right: 10px;

                svg,
                img {
                  display: block;
                  width: 50px;
                  height: 50px;
                }
              }
            }
          }
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
  }

  @media (min-width: 1400px) and (max-width: 1500px) {
    .anc-buyback > .NeuSection-content {
      section {
        div {
          p {
            font-size: 20px;
          }
        }
      }
    }
  }
`;

export const Dashboard = fixHMR(StyledDashboard);
