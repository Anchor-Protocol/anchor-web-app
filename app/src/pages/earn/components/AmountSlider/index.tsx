import { formatDemimal, formatRate } from '@libs/formatter';
import {
  HorizontalGraphBar,
  Rect,
} from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { Rate } from '@libs/types';
import { InfoOutlined } from '@material-ui/icons';
import React, { useCallback } from 'react';
import { useTheme } from 'styled-components';
import { Marker } from './Marker';

export interface Data {
  variant: 'label' | 'value';
  label: string;
  value: number;
  color: string;
  tooltip?: string;
}

const colorFunction = ({ color }: Data) => color;

const valueFunction = ({ value }: Data) => value;

const labelRenderer = (
  { label, tooltip }: Data,
  rect: Rect,
  i: number,
  onClick?: () => void,
) => {
  return (
    <Marker
      key={'label' + i}
      style={{ left: rect.x + rect.width }}
      onClick={onClick}
    >
      {tooltip ? (
        <Tooltip title={tooltip} placement="top">
          <IconSpan style={{ cursor: 'pointer' }}>
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
};

const formatter = formatDemimal({
  decimalPoints: 0,
  delimiter: true,
});

export interface AmountSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  txFee: number;
}

export const AmountSlider = ({
  value,
  max,
  onChange,
  disabled,
  txFee,
}: AmountSliderProps) => {
  const theme = useTheme();
  const valueRatio = Math.min(1, value / max);
  const allowed = max - txFee * 1.1;

  const amountSliderLabelRenderer = useCallback(
    (data: Data, rect: Rect, i: number) => {
      return labelRenderer(data, rect, i, () => {
        onChange(data.value * max);
      });
    },
    [max, onChange],
  );

  const quarterValueUST = (0.25 * max).toFixed(2);
  const halfValueUST = (0.5 * max).toFixed(2);
  const threeFourthsValueUST = (0.75 * max).toFixed(2);
  const maxValueUST = max.toFixed(2);

  // console.log('value', value);
  // console.log('max', max);
  // console.log('valueRatio', valueRatio);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={1}
      data={[
        {
          variant: 'label',
          label: '25%',
          color: 'rgba(0, 0, 0, 0)',
          value: 0.25,
          tooltip: `${quarterValueUST} UST`,
        },
        {
          variant: 'label',
          label: '50%',
          color: 'rgba(0, 0, 0, 0)',
          value: 0.5,
          tooltip: `${halfValueUST} UST`,
        },
        {
          variant: 'label',
          label: '75%',
          color: 'rgba(0, 0, 0, 0)',
          value: 0.75,
          tooltip: `${threeFourthsValueUST} UST`,
        },
        {
          variant: 'label',
          label: `Max`,
          color: 'rgba(0, 0, 0, 0)',
          value: 1,
          tooltip: `${maxValueUST} UST`,
        },
        {
          variant: 'value',
          label: `${formatRate(valueRatio.toFixed(2) as Rate)}%`,
          color:
            value > allowed ? theme.colors.negative : theme.colors.positive,
          value: Math.min(value, max) / max,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={amountSliderLabelRenderer}
    >
      {(coordinateSpace) => (
        <>
          {disabled === true ? null : (
            <HorizontalGraphSlider
              coordinateSpace={coordinateSpace}
              min={0}
              max={max}
              start={0}
              end={max}
              value={value}
              onChange={onChange}
              label={`${valueRatio < 1 ? formatter(valueRatio * 100) : '100'}%`}
            />
          )}
        </>
      )}
    </HorizontalGraphBar>
  );
};
