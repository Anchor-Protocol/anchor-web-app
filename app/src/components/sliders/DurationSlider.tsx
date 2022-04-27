import { Second } from '@libs/types';
import {
  HorizontalGraphBar,
  Rect,
} from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import React, { useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { Marker } from './Marker';
import { secondsInHour } from 'date-fns';

const secondsInDay = secondsInHour * 24;

export interface Data {
  variant: 'label' | 'value';
  label?: string;
  value: number;
  color: string;
  disabled?: boolean;
}

const pluralize = (unit: string, value: number) =>
  `${value} ${unit}${value % 10 === 1 ? '' : 's'}`;

const getDurationString = (seconds: Second) => {
  const days = Math.round(seconds / secondsInDay);

  return pluralize('day', days);
};

const colorFunction = ({ color }: Data) => color;

const valueFunction = ({ value }: Data) => value;

const labelRenderer = (
  { label }: Data,
  rect: Rect,
  i: number,
  onClick?: () => void,
) => {
  if (!label) {
    return null;
  }
  return (
    <Marker
      key={'label' + i}
      style={{ left: rect.x + rect.width }}
      onClick={onClick}
    >
      <IconSpan style={{ cursor: 'pointer' }}>
        <span className="text">{label}</span>
      </IconSpan>
    </Marker>
  );
};

export interface DurationSliderProps {
  value: Second;
  min: Second;
  max: Second;
  onChange: (value: Second) => void;
}

export const DurationSlider = ({
  value,
  min,
  max,
  onChange,
}: DurationSliderProps) => {
  const theme = useTheme();

  const durationSliderLabelRenderer = useCallback(
    (data: Data, rect: Rect, i: number) => {
      return labelRenderer(data, rect, i, () => {
        onChange((data.value * max) as Second);
      });
    },
    [max, onChange],
  );

  const data: Data[] = useMemo(() => {
    const labelsNumber = Math.floor(max / min);
    const labels: Data[] = [...Array(labelsNumber).keys()].map(
      (index: number) => {
        const seconds = min + index * min;
        const value = (seconds / max) as Second;
        const label = `${getDurationString(seconds as Second)}${
          index === 0 ? ` (minimum)` : ''
        }`;
        return {
          variant: 'label',
          label,
          value,
          color: 'rgba(0, 0, 0, 0)',
        };
      },
    );

    return [
      ...labels,
      {
        variant: 'value',
        color: theme.colors.positive,
        value: value / max,
      },
    ];
  }, [max, min, theme.colors.positive, value]);

  return (
    <Container>
      <HorizontalGraphBar<Data>
        min={0}
        max={1}
        data={data}
        colorFunction={colorFunction}
        valueFunction={valueFunction}
        labelRenderer={durationSliderLabelRenderer}
      >
        {(coordinateSpace) => (
          <HorizontalGraphSlider
            coordinateSpace={coordinateSpace}
            min={0}
            max={max}
            start={0}
            end={max}
            value={value}
            onChange={(value) => {
              onChange(Math.max(Math.round(value), min) as Second);
            }}
            label={getDurationString(value)}
          />
        )}
      </HorizontalGraphBar>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  height: 60px;
`;

export const DurationSliderPlaceholder = Container;
