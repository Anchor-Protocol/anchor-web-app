import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphSlider';
import { formatPercentage } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import React, { useCallback } from 'react';
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
  // draftLtv => (fix with amount format 0.000 -> fixed ltv)
  userMinLtv: BigSource | undefined;
  userMaxLtv: BigSource | undefined;
  onStep: (draftLtv: Big) => Big;
  onChange: (nextLtv: Big) => void;
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
  nextLtv,
  userMaxLtv,
  userMinLtv,
  onChange,
  onStep,
}: LTVGraphProps) {
  const step = useCallback(
    (draftLtv: number) => {
      return onStep(big(draftLtv)).toNumber();
    },
    [onStep],
  );

  const change = useCallback(
    (nextLtv: number) => {
      onChange(big(nextLtv));
    },
    [onChange],
  );

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={big(maxLtv).toNumber()}
      data={[
        {
          position: 'top',
          label: `MAX LTV: ${formatPercentage(big(maxLtv).mul(100))}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: big(maxLtv).toNumber(),
        },
        {
          position: 'top',
          label: `SAFE LTV: ${formatPercentage(big(safeLtv).mul(100))}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: big(safeLtv).toNumber(),
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
          label: nextLtv ? `${formatPercentage(nextLtv.mul(100))}%` : '',
          color: '#ffffff',
          value: nextLtv
            ? Math.max(Math.min(nextLtv.toNumber(), big(maxLtv).toNumber()), 0)
            : 0,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      {(coordinateSpace) => (
        <HorizontalGraphSlider
          coordinateSpace={coordinateSpace}
          min={0}
          max={big(maxLtv).toNumber()}
          start={big(userMinLtv ?? 0).toNumber()}
          end={big(userMaxLtv ?? maxLtv).toNumber()}
          value={big(nextLtv ?? 0).toNumber()}
          onChange={change}
          stepFunction={step}
        />
      )}
    </HorizontalGraphBar>
  );
}
