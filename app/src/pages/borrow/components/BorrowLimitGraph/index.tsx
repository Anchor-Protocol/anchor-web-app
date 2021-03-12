import {
  HorizontalGraphBar,
  Rect,
} from '@terra-dev/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import {
  demicrofy,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { InfoOutlined } from '@material-ui/icons';
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
const labelRenderer = ({ position, label, tooltip }: Data, rect: Rect) => {
  return position === 'top' ? (
    <GraphTick style={{ left: rect.x + rect.width }}>
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
    </GraphTick>
  ) : (
    <GraphLabel style={{ left: rect.x + rect.width }}>{label}</GraphLabel>
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
      borrowLimitRate: big(loanAmount).div(
        borrowLimit.eq(0) ? 1 : borrowLimit,
      ) as Rate<Big>,
    };
  }, [bLunaMaxLtv, collateralValue, loanAmount]);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={1}
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
          : []
      }
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      <GraphLabel style={{ left: 0 }}>
        <IconSpan>
          Borrow Limit{' '}
          <InfoTooltip>
            The maximum amount of liability permitted from deposited collaterals
          </InfoTooltip>
        </IconSpan>
      </GraphLabel>
      <GraphLabel style={{ right: 0 }}>
        ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}
      </GraphLabel>
    </HorizontalGraphBar>
  );
}
