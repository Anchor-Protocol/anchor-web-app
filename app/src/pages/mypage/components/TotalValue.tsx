import {
  AnimateNumber,
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { UST, uUST } from '@anchor-protocol/types';
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
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { Send } from '@material-ui/icons';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useBank } from '@terra-money/webapp-provider';
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
  amount: uUST<BigSource>;
}

function TotalValueBase({ className }: TotalValueProps) {
  const { tokenBalances } = useBank<AnchorTokenBalances, AnchorTax>();

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();

  const [openSend, sendElement] = useSendDialog();

  const { total, ancUstLp } = useRewards();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const { contractAddress } = useAnchorWebapp();

  const { data: { userLPStakingInfo } = {} } = useRewardsAncUstLpRewardsQuery();

  const { data: { userGovStakingInfo } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const { data: { oraclePrices } = {} } = useBorrowMarketQuery();

  const { data: { marketBorrowerInfo, overseerCollaterals } = {} } =
    useBorrowBorrowerQuery();

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { ref, width = 400 } = useResizeObserver();

  const data = useMemo<Item[]>(() => {
    return [
      { label: 'UST', amount: tokenBalances.uUST },
      {
        label: 'Deposit',
        amount: computeTotalDeposit(tokenBalances.uaUST, moneyMarketEpochState),
      },
      {
        label: 'Borrowing',
        amount:
          overseerCollaterals && oraclePrices && marketBorrowerInfo && total
            ? (computeCollateralsTotalUST(overseerCollaterals, oraclePrices)
                .minus(marketBorrowerInfo.loan_amount)
                .plus(total.rewardValue) as uUST<Big>)
            : ('0' as uUST),
      },
      {
        label: 'Holding',
        amount: computeHoldings(
          tokenBalances,
          ancPrice,
          contractAddress,
          oraclePrices,
        ),
      },
      {
        label: 'Pool',
        amount:
          ancUstLp && ancPrice
            ? (big(
                big(ancUstLp.withdrawableAssets.anc).mul(ancPrice.ANCPrice),
              ).plus(ancUstLp.withdrawableAssets.ust) as uUST<Big>)
            : ('0' as uUST),
      },
      {
        label: 'Farming',
        amount:
          userLPStakingInfo && ancPrice && userGovStakingInfo
            ? (big(
                big(ancPrice.USTPoolSize)
                  .mul(userGovStakingInfo.balance)
                  .div(ancPrice.LPShare),
              )
                .mul(2)
                .plus(userLPStakingInfo.pending_reward) as uUST<Big>)
            : ('0' as uUST),
      },
      {
        label: 'Govern',
        amount:
          userGovStakingInfo && ancPrice
            ? (big(userGovStakingInfo.balance).mul(
                ancPrice.ANCPrice,
              ) as uUST<Big>)
            : ('0' as uUST),
      },
    ];
  }, [
    ancPrice,
    ancUstLp,
    contractAddress,
    marketBorrowerInfo,
    moneyMarketEpochState,
    oraclePrices,
    overseerCollaterals,
    tokenBalances,
    total,
    userGovStakingInfo,
    userLPStakingInfo,
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
          <h4>Total Value</h4>
          <p>
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {93238.03 as UST<number>}
            </AnimateNumber>
            <Sub> UST</Sub>
          </p>
        </div>
        <div>
          <BorderButton onClick={() => openSend({})}>
            <Send />
            Send
          </BorderButton>
        </div>
      </header>

      <div className="values">
        <ul>
          {data.map(({ label, amount }, i) => (
            <li
              key={label}
              style={{ color: colors[i] }}
              data-focus={i === focusedIndex}
            >
              <i />
              <p>{label}</p>
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
