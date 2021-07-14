import {
  AnimateNumber,
  demicrofy,
  formatBAssetWithPostfixUnits,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, ubAsset, uUST } from '@anchor-protocol/types';
import {
  prettifyBAssetSymbol,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  vectorizeOraclePrices,
  vectorizeOverseerCollaterals,
} from '@anchor-protocol/webapp-provider';
import { sum, vectorMultiply } from '@terra-dev/big-math';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import big, { Big } from 'big.js';
import { Sub } from 'components/Sub';
import { fixHMR } from 'fix-hmr';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ChartItem, DoughnutChart } from './graphics/DoughnutGraph';

export interface TotalCollateralValueProps {
  className?: string;
}

const colors = ['#4bdb4b', '#1f1f1f'];

interface Item {
  label: string;
  ust: uUST;
  asset: ubAsset;
  ratio: Rate;
}

function TotalCollateralValueBase({ className }: TotalCollateralValueProps) {
  const { data: { oraclePrices, overseerWhitelist } = {} } =
    useBorrowMarketQuery();

  const { data: { overseerCollaterals } = {} } = useBorrowBorrowerQuery();

  const { total, collaterals } = useMemo(() => {
    if (!overseerCollaterals || !oraclePrices || !overseerWhitelist) {
      return { total: big(0) as uUST<Big>, collaterals: [] };
    }

    const vector = overseerWhitelist.elems
      .reverse()
      .map(({ collateral_token }) => collateral_token);
    const lockedAmounts = vectorizeOverseerCollaterals(
      vector,
      overseerCollaterals.collaterals,
    );
    const prices = vectorizeOraclePrices(vector, oraclePrices.prices);

    const ustAmounts = vectorMultiply(lockedAmounts, prices);

    const total = sum(...ustAmounts) as uUST<Big>;

    return {
      total,
      collaterals: ustAmounts.map(
        (ustAmount, i) =>
          ({
            label: prettifyBAssetSymbol(overseerWhitelist.elems[i].symbol),
            ratio: (total.gt(0)
              ? big(ustAmount).div(total).toFixed()
              : '0') as Rate,
            ust: ustAmount.toFixed() as uUST,
            asset: lockedAmounts[i] as ubAsset,
          } as Item),
      ),
    };
  }, [oraclePrices, overseerCollaterals, overseerWhitelist]);

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { ref, width = 400 } = useResizeObserver();

  const isSmallLayout = useMemo(() => {
    return width < 470;
  }, [width]);

  const chartData = useMemo<ChartItem[]>(() => {
    return collaterals.map(({ label, ust, asset, ratio }, i) => ({
      label,
      value: +ust,
      color: colors[i % colors.length],
    }));
  }, [collaterals]);

  return (
    <Section className={className}>
      <header ref={ref}>
        <h4>Total Collateral Value</h4>
        <p>
          <AnimateNumber format={formatUSTWithPostfixUnits}>
            {demicrofy(total)}
          </AnimateNumber>
          <Sub> UST</Sub>
        </p>
      </header>

      <div className="values">
        <table>
          <tbody>
            {collaterals.map(({ label, ust, asset, ratio }, i) => (
              <tr
                key={label}
                style={{ color: colors[i] }}
                data-focus={i === focusedIndex}
              >
                <th>
                  <i />
                  <span>{label}</span>
                </th>
                <td>
                  <p>{formatUSTWithPostfixUnits(demicrofy(ust))} UST</p>
                  <p>
                    {formatRate(ratio)}% (
                    {formatBAssetWithPostfixUnits(demicrofy(asset))} {label})
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isSmallLayout && (
          <DoughnutChart data={chartData} onFocus={setFocusedIndex} />
        )}
      </div>
    </Section>
  );
}

export const StyledTotalCollateralValue = styled(TotalCollateralValueBase)`
  header {
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
  }

  .values {
    margin-top: 50px;

    display: flex;
    justify-content: space-between;

    table {
      tr {
        height: 80px;

        i {
          background-color: currentColor;

          display: inline-block;
          min-width: 12px;
          min-height: 12px;
          max-width: 12px;
          max-height: 12px;
          border-radius: 3px;

          transition: transform 0.3s ease-out, border-radius 0.3s ease-out;
        }

        th {
          padding-top: 10px;
          padding-right: 10px;

          font-size: 13px;

          text-align: left;
          vertical-align: top;

          span {
            display: inline-block;
            margin-left: 4px;
            transform: translateY(-1px);
            color: ${({ theme }) => theme.dimTextColor};
          }
        }

        td {
          vertical-align: top;

          p:nth-of-type(1) {
            font-size: 20px;
            font-weight: 500;
            line-height: 1.5;

            color: ${({ theme }) => theme.textColor};
          }

          p:nth-of-type(2) {
            margin-top: 4px;

            font-size: 15px;
            font-weight: 500;
            line-height: 1.5;

            color: ${({ theme }) => theme.dimTextColor};
          }
        }

        &[data-focus='true'] {
          i {
            transform: scale(1.4);
            border-radius: 50%;
          }
        }
      }
    }

    canvas {
      min-width: 191px;
      min-height: 191px;
      max-width: 191px;
      max-height: 191px;
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

      canvas {
        display: none;
      }
    }
  }
`;

export const TotalCollateralValue = fixHMR(StyledTotalCollateralValue);
