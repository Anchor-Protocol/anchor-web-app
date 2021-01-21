import {
  Tooltip,
  TooltipProps,
} from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { InfoOutlined } from '@material-ui/icons';
import React, { ReactNode } from 'react';

export interface InfoTooltipProps
  extends Omit<TooltipProps, 'children' | 'title'> {
  children: NonNullable<ReactNode>;
}

export function InfoTooltip({ children, placement = 'top', ...tooltipProps }: InfoTooltipProps) {
  return (
    <sup>
      <Tooltip {...tooltipProps} title={children} placement={placement}>
        <InfoOutlined />
      </Tooltip>
    </sup>
  );
}
