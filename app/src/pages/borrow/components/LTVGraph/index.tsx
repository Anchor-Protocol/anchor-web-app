import { formatRate } from '@anchor-protocol/notation';
import type { Rate } from '@anchor-protocol/types';
import { InfoOutlined } from '@material-ui/icons';
import {
  HorizontalGraphBar,
  Rect,
} from '@packages/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@packages/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@packages/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@packages/neumorphism-ui/components/Tooltip';
import big, { Big, BigSource } from 'big.js';
import React, { useCallback, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
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

export interface LTVGraphProps {
  maxLtv: Rate<BigSource>;
  safeLtv: Rate<BigSource>;
  dangerLtv: Rate<BigSource>;
  currentLtv: Rate<Big> | undefined;
  nextLtv: Rate<Big> | undefined;
  // draftLtv => (fix with amount format 0.000 -> fixed ltv)
  userMinLtv: Rate<BigSource> | undefined;
  userMaxLtv: Rate<BigSource> | undefined;
  onStep: (draftLtv: Rate<Big>) => Rate<Big>;
  onChange: (nextLtv: Rate<Big>) => void;
  disabled?: boolean;
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = (
  { position, label, tooltip, color }: Data,
  rect: Rect,
  i: number,
) => {
  return position === 'top' ? (
    <GraphTick key={'label' + i} style={{ left: rect.x + rect.width }}>
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
    <GraphLabel key={'label' + i} style={{ left: rect.x + rect.width, color }}>
      {label}
    </GraphLabel>
  );
};

export function LTVGraph({
  maxLtv,
  safeLtv,
  nextLtv,
  dangerLtv,
  userMaxLtv,
  userMinLtv,
  onChange,
  onStep,
  disabled,
}: LTVGraphProps) {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery({ maxWidth: 700 });

  const step = useCallback(
    (draftLtv: number) => {
      return onStep(big(draftLtv) as Rate<Big>).toNumber();
    },
    [onStep],
  );

  const change = useCallback(
    (nextLtv: number) => {
      onChange(big(nextLtv) as Rate<Big>);
    },
    [onChange],
  );

  const color = useMemo(() => {
    return nextLtv?.gte(dangerLtv)
      ? theme.colors.negative
      : nextLtv?.gte(safeLtv)
      ? theme.colors.warning
      : theme.colors.positive;
  }, [
    dangerLtv,
    nextLtv,
    safeLtv,
    theme.colors.negative,
    theme.colors.positive,
    theme.colors.warning,
  ]);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={big(maxLtv).toNumber()}
      data={[
        {
          position: 'top',
          label: `${formatRate(maxLtv)}% LTV${isSmallScreen ? '' : ' (MAX)'}`,
          color: 'rgba(0, 0, 0, 0)',
          value: big(maxLtv).toNumber(),
          tooltip:
            'Maximum allowed loan to value (LTV) ratio, collaterals will be liquidated when the LTV is bigger than this value.',
        },
        {
          position: 'top',
          label: `${formatRate(safeLtv)}% LTV`,
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
            ? `${nextLtv.lt(1) ? formatRate(nextLtv) : '>100'}%`
            : '',
          color,
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
