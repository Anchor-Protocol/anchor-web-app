import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import React from 'react';
import styled, { useTheme } from 'styled-components';
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
    <GraphTick style={{ left: rect.x + rect.width }}>&nbsp;</GraphTick>
  ) : null;
};

export function PollTinyGraph({ total, yes, no, baseline }: PollGraphProps) {
  const theme = useTheme();

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={total}
      barHeight={8}
      boxRadius={4}
      data={[
        {
          position: 'vote',
          label: `No ${Math.floor((no / (yes + no)) * 100)}%`,
          color: '#e95979',
          value: yes + no,
        },
        {
          position: 'vote',
          label: `Yes ${Math.floor((yes / (yes + no)) * 100)}%`,
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
    >
      <TotalVoteSpan>10.8%</TotalVoteSpan>
      <YesNoSpan>
        <span className="yes">
          <b>Yes</b> {Math.floor((yes / (yes + no)) * 100)}%
        </span>
        <span className="no">
          <b>No</b> {Math.floor((no / (yes + no)) * 100)}%
        </span>
      </YesNoSpan>
    </HorizontalGraphBar>
  );
}

const TotalVoteSpan = styled(IconSpan)`
  left: 0;
  top: -27px;

  font-size: 16px;
`;

const YesNoSpan = styled.span`
  right: 0;
  top: -24px;

  font-size: 12px;

  .yes {
    color: #15cc93;
  }

  .no {
    color: #e95979;
    margin-left: 10px;
  }
`;
