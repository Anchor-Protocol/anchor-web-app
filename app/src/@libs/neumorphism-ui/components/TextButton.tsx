import { flat, pressed } from '@libs/styled-neumorphism';
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

  color: ${({ theme }) => theme.textButton.textColor};

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
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }

  &:active {
    ${({ theme }) =>
      pressed({
        color: theme.backgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }

  &:disabled {
    color: ${({ theme }) => c(theme.textButton.textColor).alpha(0.3).string()};
  }
`;
