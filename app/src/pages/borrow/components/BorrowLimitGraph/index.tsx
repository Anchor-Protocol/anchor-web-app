import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import {
  demicrofy,
  formatPercentage,
  formatUSTWithPostfixUnits,
  Ratio,
  uUST,
} from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import React, { useMemo } from 'react';
import { GraphLabel } from './GraphLabel';
import { GraphTick } from './GraphTick';

export interface Data {
  position: 'top' | 'bottom';
  label: string;
  value: number;
  color: string;
}

export interface BorrowLimitGraphProps {
  bLunaMaxLtv: Ratio<BigSource>;
  collateralValue: uUST<BigSource>;
  loanAmount: uUST<BigSource>;
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = ({ position, label }: Data, rect: Rect) => {
  return position === 'top' ? (
    <GraphTick style={{ left: rect.x + rect.width }}>{label}</GraphTick>
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
                label: `${formatPercentage(borrowLimitRatio.mul(100))}%`,
                color: '#ffffff',
                value: borrowLimitRatio.toNumber(),
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
            Maximum amount of loans permitted from deposited collaterals
          </InfoTooltip>
        </IconSpan>
      </GraphLabel>
      <GraphLabel style={{ right: 0 }}>
        ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}
      </GraphLabel>
    </HorizontalGraphBar>
  );
}
