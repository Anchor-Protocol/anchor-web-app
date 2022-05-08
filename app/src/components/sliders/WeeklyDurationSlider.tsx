import {
  HorizontalGraphBar,
  Rect,
} from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import React, { useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { Marker } from './Marker';
import { SliderContainer } from './SliderContainer';

interface Data {
  variant: 'label' | 'value';
  label?: string;
  value: number;
  color?: string;
  disabled?: boolean;
}

const colorFunction = ({ color }: Data) => color ?? 'rgba(0, 0, 0, 0)';

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

interface WeeklyDurationSliderProps {
  value: number;
  min: number;
  max: number;
  errored: boolean;
  onChange: (value: number) => void;
}

export const WeeklyDurationSlider = ({
  value,
  min,
  max,
  errored,
  onChange,
}: WeeklyDurationSliderProps) => {
  const theme = useTheme();

  const handleValueChange = useCallback(
    (value: number) => {
      onChange(Math.max(min, Math.min(Math.trunc(value), max)));
    },
    [onChange, min, max],
  );

  const durationSliderLabelRenderer = useCallback(
    (data: Data, rect: Rect, i: number) => {
      return labelRenderer(data, rect, i, () => {
        handleValueChange(data.value);
      });
    },
    [handleValueChange],
  );

  const labels: Data[] = useMemo(() => {
    // TODO: make this dynamic based on the min/max range
    return [
      {
        variant: 'label',
        label: '1 year',
        value: 52,
      },
      {
        variant: 'label',
        label: '2 years',
        value: 104,
      },
      {
        variant: 'label',
        label: '3 years',
        value: 156,
      },
      {
        variant: 'label',
        label: '4 years',
        value: 208,
      },
    ];
  }, []);

  return (
    <SliderContainer>
      <HorizontalGraphBar<Data>
        min={min}
        max={max}
        data={[
          ...labels,
          {
            variant: 'value',
            color: errored ? theme.colors.negative : theme.colors.positive,
            value,
          },
        ]}
        colorFunction={colorFunction}
        valueFunction={valueFunction}
        labelRenderer={durationSliderLabelRenderer}
      >
        {(coordinateSpace) => (
          <HorizontalGraphSlider
            coordinateSpace={coordinateSpace}
            min={min}
            max={max}
            start={0}
            end={max}
            value={value}
            onChange={handleValueChange}
            label={`${value} week${value !== 1 ? 's' : ''}`}
          />
        )}
      </HorizontalGraphBar>
    </SliderContainer>
  );
};
