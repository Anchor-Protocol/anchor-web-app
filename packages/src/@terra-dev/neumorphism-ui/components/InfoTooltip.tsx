import { InfoOutlined } from '@material-ui/icons';
import React, { ReactNode } from 'react';
import { Tooltip, TooltipProps } from './Tooltip';

export interface InfoTooltipProps
  extends Omit<TooltipProps, 'children' | 'title'> {
  children: NonNullable<ReactNode>;
}

export function InfoTooltip({
  children,
  placement = 'top',
  ...tooltipProps
}: InfoTooltipProps) {
  return (
    <sup style={{ cursor: 'help' }}>
      <Tooltip {...tooltipProps} title={children} placement={placement}>
        <InfoOutlined />
      </Tooltip>
    </sup>
  );
}
