import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUSTWithPostfixUnits,
  Ratio,
  uUST,
} from '@anchor-protocol/notation';
import { InfoOutlined } from '@material-ui/icons';
import big, { Big, BigSource } from 'big.js';
import React, { useMemo } from 'react';
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
  bLunaMaxLtv: Ratio<BigSource>;
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
  const { borrowLimit, borrowLimitRatio } = useMemo(() => {
    const borrowLimit = big(collateralValue).mul(bLunaMaxLtv) as uUST<Big>;
    return {
      borrowLimit,
      //borrowLimitRatio: big(1) as Ratio<Big>,
      borrowLimitRatio: big(loanAmount).div(
        borrowLimit.eq(0) ? 1 : borrowLimit,
      ) as Ratio<Big>,
    };
  }, [bLunaMaxLtv, collateralValue, loanAmount]);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={1}
      data={
        borrowLimitRatio.gt(0)
          ? [
              {
                position: 'top',
                label: `${formatRatioToPercentage(borrowLimitRatio)}%`,
                color: borrowLimitRatio.gte(1)
                  ? '#e95979'
                  : borrowLimitRatio.gte(0.7)
                  ? '#ff9a63'
                  : '#15cc93',
                value: borrowLimitRatio.toNumber(),
                tooltip: borrowLimitRatio.gte(1)
                  ? "Loan can be liquidated anytime upon another user's request. Repay loans with stablecoins or deposit more collateral to prevent liquidation."
                  : borrowLimitRatio.gte(0.7)
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
