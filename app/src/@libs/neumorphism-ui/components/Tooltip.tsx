import { makeStyles } from '@material-ui/core/styles';
import MuiTooltip, {
  TooltipProps as MuiTooltipProps,
} from '@material-ui/core/Tooltip';
import React from 'react';
import { MessageColor, NeumorphismTheme } from '../themes/Theme';

export interface TooltipProps extends MuiTooltipProps {
  color?: MessageColor;
}

/**
 * Styled component of the `<Tooltip/>` of the Material-UI
 *
 * @see https://material-ui.com/api/tooltip/
 */
export function Tooltip({ arrow = true, ...props }: TooltipProps) {
  const classes = useTooltipStyle(props);

  return <MuiTooltip classes={classes} arrow={arrow} {...props} />;
}

export const useTooltipStyle = makeStyles<NeumorphismTheme, TooltipProps>(
  (theme) => ({
    tooltip: ({ color = 'normal' }) => ({
      position: 'relative',
      borderRadius: 3,
      color: theme.tooltip[color].textColor,
      backgroundColor: theme.tooltip[color].backgroundColor,
      fontSize: '0.9em',
      fontWeight: 400,
      padding: '10px 15px',
      boxShadow: '1px 1px 6px 0px rgba(0,0,0,0.2)',
    }),
    arrow: ({ color = 'normal' }) => ({
      color: theme.tooltip[color].backgroundColor,
    }),
  }),
);
