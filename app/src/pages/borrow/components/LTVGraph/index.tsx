import { ANCHOR_SAFE_RATIO } from '@anchor-protocol/app-fns';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import type { Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, formatDemimal, formatRate } from '@libs/formatter';
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
import { UIElementProps } from 'components/layouts/UIElementProps';
import React, { useCallback } from 'react';
import { useTheme } from 'styled-components';
import { Footnote } from './Footnote';
import { Marker } from './Marker';
import styled from 'styled-components';

export interface Data {
  variant: 'label' | 'value';
  label: string;
  value: number;
  color: string;
  tooltip?: string;
}

const formatter = formatDemimal({
  decimalPoints: 0,
  delimiter: true,
});

const colorFunction = ({ color }: Data) => color;

const valueFunction = ({ value }: Data) => value;

const labelRenderer = (
  { variant, label, tooltip }: Data,
  rect: Rect,
  i: number,
) => {
  if (variant === 'label') {
    return (
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
    );
  }
  return null;
};

export interface LTVGraphProps extends UIElementProps {
  borrowLimit?: u<UST<Big>>;
  value: Rate<Big> | undefined;
  start: number;
  end: number;
  onStep?: (draftLtv: Rate<Big>) => Rate<Big>;
  onChange: (nextLtv: Rate<Big>) => void;
  disabled?: boolean;
}

const LTVGraphBase = (props: LTVGraphProps) => {
  const {
    className,
    borrowLimit,
    value,
    start,
    end,
    onChange,
    onStep,
    disabled,
  } = props;

  const theme = useTheme();

  const step = useCallback(
    (draftLtv: number) => {
      return onStep ? onStep(big(draftLtv) as Rate<Big>).toNumber() : draftLtv;
    },
    [onStep],
  );

  const change = useCallback(
    (nextLtv: number) => {
      onChange(big(nextLtv) as Rate<Big>);
    },
    [onChange],
  );

  const formatLabel = (value: Rate<Big> | undefined) => {
    const v = value ?? Big(0);
    return `${v.lt(1) ? formatter(v.toNumber() * 100) : '100'}%`;
  };

  return (
    <HorizontalGraphBar<Data>
      className={className}
      data-variant={
        value?.gte(0.9)
          ? 'negative'
          : value?.gte(ANCHOR_SAFE_RATIO)
          ? 'warning'
          : 'positive'
      }
      min={0}
      max={1}
      data={[
        {
          variant: 'label',
          label: `${formatRate(ANCHOR_SAFE_RATIO)}%`,
          color: 'rgba(0, 0, 0, 0)',
          value: ANCHOR_SAFE_RATIO,
          tooltip: 'Recommended borrow usage',
        },
        {
          variant: 'label',
          label: '100%',
          color: 'rgba(0, 0, 0, 0)',
          value: 1,
          tooltip:
            'When the borrow usage reaches 100%, liquidations can occur at anytime',
        },
        {
          variant: 'value',
          label: value ? `${value.lt(1) ? formatRate(value) : '>100'}%` : '',
          color: value?.gte(0.9)
            ? theme.colors.negative
            : value?.gte(ANCHOR_SAFE_RATIO)
            ? theme.colors.warning
            : theme.colors.positive,
          value: value
            ? Math.max(Math.min(value.toNumber(), big(1).toNumber()), 0)
            : 0,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      {(coordinateSpace) => (
        <>
          {disabled === true ? null : (
            <HorizontalGraphSlider
              coordinateSpace={coordinateSpace}
              min={0}
              max={1}
              start={start}
              end={end}
              value={value?.toNumber() ?? 0}
              onChange={change}
              stepFunction={step}
              label={formatLabel(value)}
            />
          )}
          {borrowLimit && (
            <Footnote style={{ right: 0 }}>
              <IconSpan>
                Borrow Limit: $
                {formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
                <InfoTooltip>
                  The maximum amount of liability permitted from deposited
                  collaterals
                </InfoTooltip>
              </IconSpan>
            </Footnote>
          )}
        </>
      )}
    </HorizontalGraphBar>
  );
};

export const LTVGraph = styled(LTVGraphBase)`
  &[data-variant='warning'] {
    .thumb-label {
      background-color: ${({ theme }) => theme.colors.warning};
      &::after {
        border-color: ${({ theme }) => theme.colors.warning} transparent
          transparent transparent;
      }
    }
  }

  &[data-variant='negative'] {
    .thumb-label {
      background-color: ${({ theme }) => theme.colors.negative};
      &::after {
        border-color: ${({ theme }) => theme.colors.negative} transparent
          transparent transparent;
      }
    }
  }
`;
