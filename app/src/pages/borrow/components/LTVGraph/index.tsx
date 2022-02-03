import {
  ANCHOR_SAFE_RATIO,
  ANCHOR_DANGER_RATIO,
} from '@anchor-protocol/app-fns';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import type { Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, formatRate } from '@libs/formatter';
import {
  HorizontalGraphBar,
  Rect,
} from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { InfoOutlined } from '@material-ui/icons';
import big, { Big } from 'big.js';
import React, { useCallback } from 'react';
import { useTheme } from 'styled-components';
import { Footnote } from './Footnote';
import { Label } from './Label';
import { Marker } from './Marker';

export interface Data {
  variant: 'label' | 'value';
  label: string;
  value: number;
  color: string;
  tooltip?: string;
}

export interface LTVGraphProps {
  // maxLtv: Rate<BigSource>;
  // safeLtv: Rate<BigSource>;
  // dangerLtv: Rate<BigSource>;
  borrowLimit: u<UST<Big>>;
  currentLtv: Rate<Big> | undefined;
  nextLtv: Rate<Big> | undefined;
  // // draftLtv => (fix with amount format 0.000 -> fixed ltv)
  // userMinLtv: Rate<BigSource> | undefined;
  // userMaxLtv: Rate<BigSource> | undefined;
  // borrowedValue: u<UST<Big>>;
  onStep: (draftLtv: Rate<Big>) => Rate<Big>;
  onChange: (nextLtv: Rate<Big>) => void;
  disabled?: boolean;
}

const colorFunction = ({ color }: Data) => color;

const valueFunction = ({ value }: Data) => value;

const labelRenderer = (
  { variant, label, tooltip, color }: Data,
  rect: Rect,
  i: number,
) => {
  return variant === 'label' ? (
    <Marker key={'label' + i} style={{ left: rect.x + rect.width }}>
      {tooltip ? (
        <Tooltip title={tooltip} placement="top">
          <IconSpan style={{ cursor: 'help' }}>
            <sup>
              <InfoOutlined />
            </sup>{' '}
            <span className="text">{label}</span>
          </IconSpan>
        </Tooltip>
      ) : (
        label
      )}
    </Marker>
  ) : (
    <Label key={'label' + i} style={{ left: rect.x + rect.width, color }}>
      <span>{label}</span>
    </Label>
  );
};

export function LTVGraph({
  borrowLimit,
  currentLtv,
  nextLtv,
  onChange,
  onStep,
  disabled,
}: LTVGraphProps) {
  const theme = useTheme();

  //const isSmallScreen = useMediaQuery({ maxWidth: 700 });

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

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={1}
      data={[
        {
          variant: 'label',
          label: `${formatRate(ANCHOR_SAFE_RATIO)}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: ANCHOR_SAFE_RATIO,
          tooltip: 'Recommended LTV',
        },
        {
          variant: 'label',
          label: '100%',
          color: 'rgba(0, 0, 0, 0)',
          value: 1,
          tooltip: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
          variant: 'value',
          label: nextLtv
            ? `${nextLtv.lt(1) ? formatRate(nextLtv) : '>100'}%`
            : '',
          color: nextLtv?.gte(ANCHOR_DANGER_RATIO)
            ? theme.colors.negative
            : nextLtv?.gte(ANCHOR_SAFE_RATIO)
            ? theme.colors.warning
            : theme.colors.positive,
          value: nextLtv
            ? Math.max(Math.min(nextLtv.toNumber(), big(1).toNumber()), 0)
            : 0,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      {({ coordinateSpace }) => (
        <>
          {disabled === true ? null : (
            <HorizontalGraphSlider
              coordinateSpace={coordinateSpace}
              min={0}
              max={1}
              start={currentLtv?.toNumber() ?? 0}
              end={ANCHOR_DANGER_RATIO}
              value={nextLtv?.toNumber() ?? 0}
              onChange={change}
              stepFunction={step}
            />
          )}
          <Footnote style={{ right: 0 }}>
            <IconSpan>
              Borrow Limit: ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
              <InfoTooltip>
                The maximum amount of liability permitted from deposited
                collaterals
              </InfoTooltip>
            </IconSpan>
          </Footnote>
        </>
      )}
    </HorizontalGraphBar>
  );
}
