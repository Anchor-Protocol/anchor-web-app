import { Second } from '@libs/types';
import {
  HorizontalGraphBar,
  Rect,
} from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import React, { useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { Marker } from './Marker';
import { secondsInHour } from 'date-fns';
import { SliderContainer } from './SliderContainer';

const secondsInDay = secondsInHour * 24;
const daysInYear = 365;
const labelsNumber = 4;

interface Data {
  variant: 'label' | 'value';
  label?: string;
  value: number;
  color: string;
  disabled?: boolean;
}

const pluralize = (unit: string, value: number) =>
  `${value} ${unit}${value % 10 === 1 ? '' : 's'}`;

const getDurationString = (seconds: Second) => {
  const totalDays = Math.round(seconds / secondsInDay);
  const years = Math.floor(totalDays / daysInYear);
  const days = totalDays - years * daysInYear;

  return `${years > 0 ? pluralize('year', years) : ''} ${
    days > 0 ? pluralize('day', days) : ''
  }`;
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
  step: Second;
  onChange: (value: Second) => void;
}

export const DurationSlider = ({
  value,
  min,
  max,
  step,
  onChange,
}: DurationSliderProps) => {
  const theme = useTheme();

  const adjustValue = useCallback(
    (value: Second) => {
      const stepsCount = Math.round((value - min) / step);
      const stepAdjustedValue = min + stepsCount * step;
      return Math.max(Math.min(stepAdjustedValue, max), min);
    },
    [max, min, step],
  );

  const handleValueChange = useCallback(
    (value: number) => {
      onChange(adjustValue(value as Second) as Second);
    },
    [adjustValue, onChange],
  );

  const durationSliderLabelRenderer = useCallback(
    (data: Data, rect: Rect, i: number) => {
      return labelRenderer(data, rect, i, () => {
        handleValueChange(data.value * max);
      });
    },
    [handleValueChange, max],
  );

  const data: Data[] = useMemo(() => {
    const labelStep = max / labelsNumber;
    const labels: Data[] = [...Array(labelsNumber).keys()].map(
      (index: number) => {
        const seconds = (labelStep * (index + 1)) as Second;
        const value = seconds / max;
        const label = getDurationString(seconds);
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
  }, [max, theme.colors.positive, value]);

  return (
    <SliderContainer>
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
            onChange={handleValueChange}
            label={getDurationString(value)}
          />
        )}
      </HorizontalGraphBar>
    </SliderContainer>
  );
};
