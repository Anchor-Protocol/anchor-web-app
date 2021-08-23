import { ClickAwayListener } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import { isTouchDevice } from '@libs/is-touch-device';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Tooltip, TooltipProps } from './Tooltip';

export interface InfoTooltipProps
  extends Omit<TooltipProps, 'children' | 'title'> {
  children: NonNullable<ReactNode>;
}

export function InfoTooltip(props: InfoTooltipProps) {
  const touchDevice = useMemo(() => isTouchDevice(), []);

  return touchDevice ? (
    <TouchTooltip {...props} />
  ) : (
    <PointerTooltip {...props} />
  );
}

export function PointerTooltip({
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

export function TouchTooltip({
  children,
  placement = 'top',
  ...tooltipProps
}: InfoTooltipProps) {
  const [open, setOpen] = useState<boolean>(false);

  const tooltipOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const tooltipClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ClickAwayListener onClickAway={tooltipClose}>
      <sup onClick={tooltipOpen}>
        <Tooltip
          {...tooltipProps}
          open={open}
          onClose={tooltipClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={children}
          placement={placement}
        >
          <InfoOutlined />
        </Tooltip>
      </sup>
    </ClickAwayListener>
  );
}
