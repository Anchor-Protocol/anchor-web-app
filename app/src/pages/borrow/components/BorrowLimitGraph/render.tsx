import { InfoOutlined } from '@material-ui/icons';
import { Rect } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import React from 'react';
import { GraphLabel } from './GraphLabel';
import { GraphMarkerTick } from './GraphMarkerTick';
import { GraphTick } from './GraphTick';

export interface RenderData {
  position: 'top' | 'top-marker' | 'bottom';
  label: string;
  value: number;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
  tooltip?: string;
}

export const colorFunction = ({ color }: RenderData) => color;
export const valueFunction = ({ value }: RenderData) => value;
export const labelRenderer = (
  { position, label, tooltip, textAlign = 'center' }: RenderData,
  rect: Rect,
  i: number,
) => {
  return position === 'top' ? (
    <GraphTick
      key={'label' + i}
      style={{
        transform: `translateX(${rect.x + rect.width}px)`,
        opacity: label.length === 0 ? 0 : 1,
      }}
    >
      <span>
        {tooltip ? (
          <Tooltip title={tooltip} placement="top">
            <IconSpan style={{ cursor: 'help' }}>
              <sup>
                <InfoOutlined />
              </sup>{' '}
              {label}
            </IconSpan>
          </Tooltip>
        ) : (
          label
        )}
      </span>
    </GraphTick>
  ) : position === 'top-marker' ? (
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
              <sup>
                <InfoOutlined />
              </sup>{' '}
              {label}
            </IconSpan>
          </Tooltip>
        ) : (
          label
        )}
      </span>
    </GraphMarkerTick>
  ) : (
    <GraphLabel key={'label' + i} style={{ left: rect.x + rect.width }}>
      {label}
    </GraphLabel>
  );
};
