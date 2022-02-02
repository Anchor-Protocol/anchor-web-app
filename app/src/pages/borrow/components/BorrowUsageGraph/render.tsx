import React from 'react';
import { InfoOutlined } from '@material-ui/icons';
import { Rect } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { GraphMarkerTick } from './GraphMarkerTick';
import { GraphLabel } from './GraphLabel';

export interface RenderData {
  variant: 'marker' | 'label';
  label: string;
  value: number;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
  tooltip?: string;
}

export const colorFunction = ({ color }: RenderData) => color;

export const valueFunction = ({ value }: RenderData) => value;

export const labelRenderer = (
  { variant, label, tooltip, textAlign = 'center', color }: RenderData,
  rect: Rect,
  i: number,
) => {
  return variant === 'label' ? (
    <GraphLabel
      key={'label' + i}
      style={{
        transform: `translateX(${rect.x + rect.width}px)`,
        opacity: label.length === 0 ? 0 : 1,
        color,
      }}
    >
      <span>{label}</span>
    </GraphLabel>
  ) : (
    <GraphMarkerTick
      key={'label' + i}
      textAlign={textAlign}
      style={{
        transform: `translateX(${rect.x + rect.width}px)`,
        opacity: label.length === 0 ? 0 : 1,
      }}
    >
      <span>
        {tooltip ? (
          <Tooltip title={tooltip} placement="top">
            <IconSpan style={{ cursor: 'help', letterSpacing: '-0.5px' }}>
              {label}
              <sup>
                <InfoOutlined />
              </sup>{' '}
            </IconSpan>
          </Tooltip>
        ) : (
          label
        )}
      </span>
    </GraphMarkerTick>
  );
};
