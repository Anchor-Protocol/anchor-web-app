import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { formatPercentage } from '@anchor-protocol/notation';
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

export interface LTVGraphProps {
  maxLtv: BigSource;
  safeLtv: BigSource;
  currentLtv: Big | undefined;
  nextLtv: Big | undefined;
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

export function LTVGraph({
  maxLtv,
  safeLtv,
  currentLtv,
  nextLtv,
}: LTVGraphProps) {
  const ltvs = useMemo(() => {
    return {
      current: currentLtv,
      next: nextLtv,
      max: big(maxLtv),
      safe: big(safeLtv),
    };
  }, [currentLtv, maxLtv, nextLtv, safeLtv]);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={ltvs.max.toNumber()}
      data={[
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
        //{
        //  position: 'top',
        //  label: ltvs.current
        //    ? `CURRENT LTV: ${formatPercentage(ltvs.safe.mul(100))}%`
        //    : '',
        //  color: 'rgba(0, 0, 0, 0)',
        //  value: ltvs.current
        //    ? Math.max(Math.min(ltvs.safe.toNumber(), ltvs.max.toNumber()), 0)
        //    : 0,
        //},
        {
          position: 'bottom',
          label: ltvs.next ? `${formatPercentage(ltvs.next.mul(100))}%` : '',
          color: '#ffffff',
          value: ltvs.next
            ? Math.max(Math.min(ltvs.next.toNumber(), ltvs.max.toNumber()), 0)
            : 0,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    />
  );
}
