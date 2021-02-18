import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import React from 'react';
import { useTheme } from 'styled-components';
import { GraphTick } from './GraphTick';

export interface Data {
  position: 'baseline' | 'vote';
  label: string;
  value: number;
  color: string;
}

export interface PollGraphProps {
  total: number;
  yes: number;
  no: number;
  baseline: number;
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = ({ position, label, color }: Data, rect: Rect) => {
  return position === 'baseline' ? (
    <GraphTick style={{ left: rect.x + rect.width }}>{label}</GraphTick>
  ) : null;
};

export function PollGraph({ total, yes, no, baseline }: PollGraphProps) {
  const theme = useTheme();

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={total}
      data={[
        {
          position: 'vote',
          label: `No ${Math.floor((no / yes + no) * 100)}%`,
          color: '#e95979',
          value: yes + no,
        },
        {
          position: 'vote',
          label: `Yes ${Math.floor((yes / yes + no) * 100)}%`,
          color: '#15cc93',
          value: yes,
        },
        {
          position: 'baseline',
          label: 'Pass Threshold',
          color: theme.dimTextColor,
          value: baseline,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    />
  );
}
