import { Second } from '@libs/types';
import React from 'react';

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
  return (
    <p>
      Duration slider will be here! {value} {min} {max}
    </p>
  );
};
