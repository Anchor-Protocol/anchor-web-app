import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { formatPercentage } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { safeRatio } from 'env';
import React, { useMemo } from 'react';
import { GraphLabel } from './GraphLabel';
import { GraphTick } from './GraphTick';

export interface Data {
  position: 'top' | 'bottom';
  label: string;
  value: number;
  color: string;
}

export interface LTVGraphProps {
  maxLtv: BigSource;
  userLtv: Big | undefined;
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

export function LTVGraph({ maxLtv, userLtv }: LTVGraphProps) {
  const ltvs = useMemo(() => {
    return {
      user: userLtv,
      max: big(maxLtv),
      safe: big(maxLtv).mul(safeRatio),
    };
  }, [maxLtv, userLtv]);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={ltvs.max.toNumber() * 2}
      values={[
        {
          position: 'top',
          label: `MAX LTV: ${formatPercentage(ltvs.max.mul(100))}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: ltvs.max.toNumber(),
        },
        {
          position: 'top',
          label: `SAFE LTV: ${formatPercentage(ltvs.safe.mul(100))}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: ltvs.safe.toNumber(),
        },
        {
          position: 'bottom',
          label: ltvs.user ? `${formatPercentage(ltvs.user.mul(100))}%` : '',
          color: '#ffffff',
          value: ltvs.user
            ? Math.max(
                Math.min(ltvs.user.toNumber(), ltvs.max.toNumber() * 2),
                0,
              )
            : 0,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    />
  );
}
