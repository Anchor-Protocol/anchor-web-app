import { ClickAwayListener } from '@material-ui/core';
import { isTouchDevice } from '@libs/is-touch-device';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Label } from './Label';
import { Tooltip, TooltipProps } from './Tooltip';

export interface TooltipLabelProps extends Omit<TooltipProps, 'children'> {
  children: ReactNode;
}

export function TooltipLabel(props: TooltipLabelProps) {
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
  style,
  className,
  placement = 'top',
  ...tooltipProps
}: TooltipLabelProps) {
  return (
    <Tooltip {...tooltipProps} title={title} placement={placement}>
      <Label style={style} className={className}>
        {children}
      </Label>
    </Tooltip>
  );
}

export function TouchTooltip({
  children,
  title,
  style,
  className,
  placement = 'top',
  ...tooltipProps
}: TooltipLabelProps) {
  const [open, setOpen] = useState<boolean>(false);

  const tooltipOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const tooltipClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ClickAwayListener onClickAway={tooltipClose}>
      <Label style={style} className={className} onClick={tooltipOpen}>
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
      </Label>
    </ClickAwayListener>
  );
}
