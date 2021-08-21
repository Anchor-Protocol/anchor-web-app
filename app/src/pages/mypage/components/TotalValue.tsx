import {
  AnimateNumber,
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  computeCollateralsTotalUST,
  computeTotalDeposit,
} from '@anchor-protocol/webapp-fns';
import {
  useAnchorWebapp,
  useAncPriceQuery,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  useEarnEpochStatesQuery,
  useRewardsAncGovernanceRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { Send } from '@material-ui/icons';
import { sum } from '@packages/big-math';
import { BorderButton } from '@packages/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@packages/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@packages/neumorphism-ui/components/InfoTooltip';
import { Section } from '@packages/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@packages/webapp-provider';
import big, { Big, BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import { fixHMR } from 'fix-hmr';
import { computeHoldings } from 'pages/mypage/logics/computeHoldings';
import { useRewards } from 'pages/mypage/logics/useRewards';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ChartItem, DoughnutChart } from './graphics/DoughnutGraph';

export interface TotalValueProps {
  className?: string;
}

const colors = [
  '#4bdb4b',
  '#36a337',
  '#2d832d',
  '#246d25',
  '#174f1a',
  '#0e3311',
  '#101010',
];

interface Item {
  label: string;
  tooltip: string;
  amount: uUST<BigSource>;
}

function TotalValueBase({ className }: TotalValueProps) {
  const connectedWallet = useConnectedWallet();

  const { tokenBalances } = useBank<AnchorTokenBalances, AnchorTax>();

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();

  const [openSend, sendElement] = useSendDialog();

  const { ancUstLp, ustBorrow } = useRewards();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const { contractAddress } = useAnchorWebapp();

  const { data: { userGovStakingInfo } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const { data: { oraclePrices } = {} } = useBorrowMarketQuery();

  const { data: { marketBorrowerInfo, overseerCollaterals } = {} } =
    useBorrowBorrowerQuery();

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { ref, width = 400 } = useResizeObserver();

  const { totalValue, data } = useMemo<{
    totalValue: uUST<BigSource>;
    data: Item[];
  }>(() => {
    if (!connectedWallet) {
      return { totalValue: '0' as uUST, data: [] };
    }

    const ust = tokenBalances.uUST;
    const deposit = computeTotalDeposit(
      tokenBalances.uaUST,
      moneyMarketEpochState,
    );
    const borrowing =
      overseerCollaterals && oraclePrices && marketBorrowerInfo && ustBorrow
        ? (computeCollateralsTotalUST(overseerCollaterals, oraclePrices)
            .minus(marketBorrowerInfo.loan_amount)
            .plus(ustBorrow.rewardValue) as uUST<Big>)
        : ('0' as uUST);
    const holdings = computeHoldings(
      tokenBalances,
      ancPrice,
      contractAddress,
      oraclePrices,
    );
    const pool =
      ancUstLp && ancPrice
        ? (big(big(ancUstLp.poolAssets.anc).mul(ancPrice.ANCPrice)).plus(
            ancUstLp.poolAssets.ust,
          ) as uUST<Big>)
        : ('0' as uUST);
    const farming = ancUstLp
      ? (big(ancUstLp.stakedValue).plus(ancUstLp.rewardValue) as uUST<Big>)
      : ('0' as uUST);
    const govern =
      userGovStakingInfo && ancPrice
        ? (big(userGovStakingInfo.balance).mul(ancPrice.ANCPrice) as uUST<Big>)
        : ('0' as uUST);

    const totalValue = sum(
      ust,
      deposit,
      borrowing,
      holdings,
      pool,
      farming,
      govern,
    ) as uUST<Big>;

    return {
      totalValue,
      data: [
        {
          label: 'UST',
          tooltip: 'Total amount of UST held',
          amount: ust,
        },
        {
          label: 'Deposit',
          tooltip: 'Total amount of UST deposited and interest generated',
          amount: deposit,
        },
        {
          label: 'Borrowing',
          tooltip:
            'Total value of collateral value and pending rewards minus loan amount',
          amount: borrowing,
        },
        {
          label: 'Holdings',
          tooltip: 'Total value of ANC and bAssets held',
          amount: holdings,
        },
        {
          label: 'Pool',
          tooltip:
            'Total value of ANC and UST withdrawable from liquidity pools',
          amount: pool,
        },
        {
          label: 'Farming',
          tooltip: 'Total value of ANC LP tokens staked and pending rewards',
          amount: farming,
        },
        {
          label: 'Govern',
          tooltip: 'Total value of staked ANC and unclaimed voting rewards',
          amount: govern,
        },
      ],
    };
  }, [
    ancPrice,
    ancUstLp,
    connectedWallet,
    contractAddress,
    marketBorrowerInfo,
    moneyMarketEpochState,
    oraclePrices,
    overseerCollaterals,
    tokenBalances,
    userGovStakingInfo,
    ustBorrow,
  ]);

  const isSmallLayout = useMemo(() => {
    return width < 470;
  }, [width]);

  const chartData = useMemo<ChartItem[]>(() => {
    return data.map(({ label, amount }, i) => ({
      label,
      value: +amount,
      color: colors[i % colors.length],
    }));
  }, [data]);

  return (
    <Section className={className} data-small-layout={isSmallLayout}>
      <header ref={ref}>
        <div>
          <h4>
            <IconSpan>
              Total Value{' '}
              <InfoTooltip>
                Total value of deposits, borrowing, holdings, withdrawable
                liquidity, rewards, staked ANC, and UST held
              </InfoTooltip>
            </IconSpan>
          </h4>
          <p>
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {demicrofy(totalValue)}
            </AnimateNumber>
            <Sub> UST</Sub>
          </p>
        </div>
        <div>
          <BorderButton
            onClick={() => openSend({})}
            disabled={!connectedWallet}
          >
            <Send />
            Send
          </BorderButton>
        </div>
      </header>

      <div className="values">
        <ul>
          {data.map(({ label, tooltip, amount }, i) => (
            <li
              key={label}
              style={{ color: colors[i] }}
              data-focus={i === focusedIndex}
            >
              <i />
              <p>
                <IconSpan>
                  {label} <InfoTooltip>{tooltip}</InfoTooltip>
                </IconSpan>
              </p>
              <p>{formatUSTWithPostfixUnits(demicrofy(amount))} UST</p>
            </li>
          ))}
        </ul>

        {!isSmallLayout && (
          <DoughnutChart data={chartData} onFocus={setFocusedIndex} />
        )}
      </div>

      {sendElement}
    </Section>
  );
}

export const StyledTotalValue = styled(TotalValueBase)`
  header {
    display: flex;
    justify-content: space-between;

    h4 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    p {
      font-size: clamp(20px, 8vw, 36px);
      font-weight: 500;

      sub {
        font-size: 20px;
      }
    }

    button {
      font-size: 14px;
      padding: 0 13px;
      height: 32px;

      svg {
        font-size: 1em;
        margin-right: 0.3em;
      }
    }
  }

  .values {
    margin-top: 50px;

    display: flex;
    justify-content: space-between;

    ul {
      padding: 0 0 0 12px;
      list-style: none;

      display: inline-grid;
      grid-template-rows: repeat(4, auto);
      grid-auto-flow: column;
      grid-row-gap: 20px;
      grid-column-gap: 50px;

      li {
        position: relative;

        i {
          background-color: currentColor;

          position: absolute;
          left: -12px;
          top: 5px;

          display: inline-block;
          min-width: 7px;
          min-height: 7px;
          max-width: 7px;
          max-height: 7px;

          transition: transform 0.3s ease-out, border-radius 0.3s ease-out;
        }

        p:nth-of-type(1) {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;

          color: ${({ theme }) => theme.textColor};
        }

        p:nth-of-type(2) {
          font-size: 13px;
          line-height: 1.5;

          color: ${({ theme }) => theme.textColor};
        }

        &[data-focus='true'] {
          i {
            transform: scale(2);
            border-radius: 50%;
          }
        }
      }
    }

    canvas {
      min-width: 210px;
      min-height: 210px;
      max-width: 210px;
      max-height: 210px;
    }
  }

  &[data-small-layout='true'] {
    header {
      flex-direction: column;

      button {
        margin-top: 1em;

        width: 100%;
      }
    }

    .values {
      margin-top: 30px;
      display: block;

      ul {
        display: grid;
      }

      canvas {
        display: none;
      }
    }
  }
`;

export const TotalValue = fixHMR(StyledTotalValue);
