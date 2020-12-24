import { flat, pressed } from '@anchor-protocol/styled-neumorphism';
import { ButtonBase } from '@material-ui/core';
import c from 'color';
import styled from 'styled-components';
import { buttonBaseStyle } from './ActionButton';

/**
 * A styled component of the `<ButtonBase />` of the Material-UI
 *
 * @see https://material-ui.com/api/button-base/
 */
export const TextButton = styled(ButtonBase).attrs({ disableRipple: true })`
  ${buttonBaseStyle};

  ${({ theme }) =>
    flat({
      color: theme.backgroundColor,
      distance: 0.1,
      intensity: theme.intensity,
    })};

  &:hover {
    ${({ theme }) =>
      flat({
        color: theme.backgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};
  }

  &:active {
    ${({ theme }) =>
      pressed({
        color: theme.textInput.backgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};
  }

  &:disabled {
    color: ${({ theme }) => c(theme.actionButton.textColor).alpha(0.3).string()};
  }
`;
