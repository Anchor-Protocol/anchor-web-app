import {
  demicrofy,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { InfoOutlined } from '@material-ui/icons';
import {
  HorizontalGraphBar,
  Rect,
} from '@terra-dev/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import big, { Big, BigSource } from 'big.js';
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { GraphLabel } from './GraphLabel';
import { GraphTick } from './GraphTick';

export interface Data {
  position: 'top' | 'bottom';
  label: string;
  value: number;
  color: string;
  tooltip?: string;
}

export interface BorrowLimitGraphProps {
  bLunaMaxLtv: Rate<BigSource>;
  collateralValue: uUST<BigSource>;
  loanAmount: uUST<BigSource>;
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = (
  { position, label, tooltip }: Data,
  rect: Rect,
  i: number,
) => {
  return position === 'top' ? (
    <GraphTick
      key={'label' + i}
      style={{
        transform: `translateX(${rect.x + rect.width}px)`,
        opacity: label.length === 0 ? 0 : 1,
      }}
    >
      <span>
        {tooltip ? (
          <Tooltip title={tooltip} placement="top">
            <IconSpan style={{ cursor: 'help' }}>
              <sup>
                <InfoOutlined />
              </sup>{' '}
              {label}
            </IconSpan>
          </Tooltip>
        ) : (
          label
        )}
      </span>
    </GraphTick>
  ) : (
    <GraphLabel key={'label' + i} style={{ left: rect.x + rect.width }}>
      {label}
    </GraphLabel>
  );
};

export function BorrowLimitGraph({
  bLunaMaxLtv,
  collateralValue,
  loanAmount,
}: BorrowLimitGraphProps) {
  const theme = useTheme();

  const { borrowLimit, borrowLimitRate } = useMemo(() => {
    const borrowLimit = big(collateralValue).mul(bLunaMaxLtv) as uUST<Big>;
    return {
      borrowLimit,
      //borrowLimitRate: big(1) as Rate<Big>,
      borrowLimitRate: !borrowLimit.eq(0)
        ? (big(loanAmount).div(borrowLimit) as Rate<Big>)
        : (big(0) as Rate<Big>),
    };
  }, [bLunaMaxLtv, collateralValue, loanAmount]);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={1}
      animate
      data={
        borrowLimitRate.gt(0)
          ? [
              {
                position: 'top',
                label: `${formatRate(borrowLimitRate)}%`,
                color: borrowLimitRate.gte(1)
                  ? theme.colors.negative
                  : borrowLimitRate.gte(0.7)
                  ? theme.colors.warning
                  : theme.colors.positive,
                value: borrowLimitRate.toNumber(),
                tooltip: borrowLimitRate.gte(1)
                  ? "Loan can be liquidated anytime upon another user's request. Repay loans with stablecoins or deposit more collateral to prevent liquidation."
                  : borrowLimitRate.gte(0.7)
                  ? 'Loan is close to liquidation. Repay loan with stablecoins or deposit more collateral.'
                  : undefined,
              },
            ]
          : [
              {
                position: 'top',
                label: '',
                color: theme.colors.positive,
                value: 0,
                tooltip: undefined,
              },
            ]
      }
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      <GraphLabel style={{ left: 0 }}>
        <IconSpan>
          LTV <InfoTooltip>Loan to Value ratio</InfoTooltip>
        </IconSpan>
      </GraphLabel>
      <GraphLabel style={{ right: 0 }}>
        <IconSpan>
          Borrow Limit: ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
          <InfoTooltip>
            The maximum amount of liability permitted from deposited collaterals
          </InfoTooltip>
        </IconSpan>
      </GraphLabel>
    </HorizontalGraphBar>
  );
}
