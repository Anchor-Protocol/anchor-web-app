import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { formatRatioToPercentage, Ratio } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import React, { useCallback } from 'react';
import { GraphLabel } from './GraphLabel';
import { GraphTick } from './GraphTick';

export interface Data {
  position: 'top' | 'bottom';
  label: string;
  value: number;
  color: string;
  tooltip?: string;
}

export interface LTVGraphProps {
  maxLtv: Ratio<BigSource>;
  safeLtv: Ratio<BigSource>;
  currentLtv: Ratio<Big> | undefined;
  nextLtv: Ratio<Big> | undefined;
  // draftLtv => (fix with amount format 0.000 -> fixed ltv)
  userMinLtv: Ratio<BigSource> | undefined;
  userMaxLtv: Ratio<BigSource> | undefined;
  onStep: (draftLtv: Ratio<Big>) => Ratio<Big>;
  onChange: (nextLtv: Ratio<Big>) => void;
  disabled?: boolean;
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = ({ position, label, tooltip }: Data, rect: Rect) => {
  return position === 'top' ? (
    <GraphTick style={{ left: rect.x + rect.width }}>
      {tooltip ? (
        <Tooltip title={tooltip} placement="top">
          <IconSpan>{label}</IconSpan>
        </Tooltip>
      ) : (
        label
      )}
    </GraphTick>
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
  disabled,
}: LTVGraphProps) {
  const step = useCallback(
    (draftLtv: number) => {
      return onStep(big(draftLtv) as Ratio<Big>).toNumber();
    },
    [onStep],
  );

  const change = useCallback(
    (nextLtv: number) => {
      onChange(big(nextLtv) as Ratio<Big>);
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
          label: `MAX LTV: ${formatRatioToPercentage(maxLtv)}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: big(maxLtv).toNumber(),
          tooltip:
            'Maximum allowed loan to value (LTV) ratio, collaterals will be liquidated when the LTV is bigger than this value.',
        },
        {
          position: 'top',
          label: `SAFE LTV: ${formatRatioToPercentage(safeLtv)}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: big(safeLtv).toNumber(),
          tooltip: 'Recommended LTV',
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
          label: nextLtv
            ? `${nextLtv.lt(1) ? formatRatioToPercentage(nextLtv) : '>100'}%`
            : '',
          color: nextLtv?.gt(maxLtv)
            ? '#e95979'
            : nextLtv?.gt(safeLtv)
            ? '#ff9a63'
            : '#15cc93',
          value: nextLtv
            ? Math.max(Math.min(nextLtv.toNumber(), big(maxLtv).toNumber()), 0)
            : 0,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      {(coordinateSpace) =>
        disabled === true ? null : (
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
        )
      }
    </HorizontalGraphBar>
  );
}
