import { rulerLightColor, rulerShadowColor } from '@libs/styled-neumorphism';
import React from 'react';
import { useTheme } from 'styled-components';

export interface ChartRulerProps {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export function ChartRuler({ x1, x2, y1, y2 }: ChartRulerProps) {
  const theme = useTheme();

  return (
    <>
      <line
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
        strokeWidth={1}
        stroke={rulerShadowColor({
          color: theme.textInput.backgroundColor,
          intensity: theme.intensity,
        })}
      />
      <line
        x1={x1}
        x2={x2}
        y1={y1 + 1}
        y2={y2 + 1}
        strokeWidth={1}
        stroke={rulerLightColor({
          color: theme.textInput.backgroundColor,
          intensity: theme.intensity,
        })}
      />
    </>
  );
}
