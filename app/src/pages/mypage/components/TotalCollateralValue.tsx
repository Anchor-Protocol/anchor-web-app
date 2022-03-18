import {
  formatBAssetWithPostfixUnits,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { bAsset, Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, formatRate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { Big } from 'big.js';
import { Sub } from 'components/Sub';
import { fixHMR } from 'fix-hmr';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ChartItem, DoughnutChart } from './graphics/DoughnutGraph';
import { useTheme } from 'contexts/theme';

export interface CollateralItem {
  label: string;
  ust: u<UST>;
  asset: u<bAsset>;
  ratio: Rate;
}

export interface TotalCollateralValueProps {
  className?: string;
  total: u<UST<Big>>;
  collaterals: CollateralItem[];
}

function TotalCollateralValueBase({
  className,
  total,
  collaterals,
}: TotalCollateralValueProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { theme } = useTheme();

  const { ref, width = 400 } = useResizeObserver();

  const isSmallLayout = useMemo(() => {
    return width < 470;
  }, [width]);

  const chartData = useMemo<ChartItem[]>(() => {
    return collaterals.map(({ label, ust, asset, ratio }, i) => ({
      label,
      value: +ust,
      color: theme.chart[i % theme.chart.length],
    }));
  }, [collaterals, theme]);

  return (
    <Section className={className}>
      <header ref={ref}>
        <h4>
          <IconSpan>
            TOTAL COLLATERAL VALUE{' '}
            <InfoTooltip>
              The total value of bAsset collaterals locked in Anchor
            </InfoTooltip>
          </IconSpan>
        </h4>
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
                style={{ color: theme.chart[i] }}
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
