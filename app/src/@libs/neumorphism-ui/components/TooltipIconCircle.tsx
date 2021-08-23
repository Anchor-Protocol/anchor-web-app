import { ClickAwayListener } from '@material-ui/core';
import { isTouchDevice } from '@libs/is-touch-device';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { IconCircle } from './IconCircle';
import { Tooltip, TooltipProps } from './Tooltip';

export interface TooltipIconCircleProps extends Omit<TooltipProps, 'children'> {
  children: ReactNode;
}

export function TooltipIconCircle(props: TooltipIconCircleProps) {
  const touchDevice = useMemo(() => isTouchDevice(), []);

  return touchDevice ? (
    <TouchTooltip {...props} />
  ) : (
    <PointerTooltip {...props} />
  );
}

export function PointerTooltip({
  children,
  title,
  className,
  style,
  placement = 'top',
  ...tooltipProps
}: TooltipIconCircleProps) {
  return (
    <Tooltip {...tooltipProps} title={title} placement={placement}>
      <IconCircle style={style} className={className}>
        {children}
      </IconCircle>
    </Tooltip>
  );
}

export function TouchTooltip({
  children,
  title,
  className,
  style,
  placement = 'top',
  ...tooltipProps
}: TooltipIconCircleProps) {
  const [open, setOpen] = useState<boolean>(false);

  const tooltipOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const tooltipClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ClickAwayListener onClickAway={tooltipClose}>
      <IconCircle style={style} className={className} onClick={tooltipOpen}>
        <Tooltip
          {...tooltipProps}
          open={open}
          onClose={tooltipClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={title}
          placement={placement}
        >
          <span>{children}</span>
        </Tooltip>
      </IconCircle>
    </ClickAwayListener>
  );
}
