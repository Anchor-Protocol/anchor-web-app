import { pressed } from '@libs/styled-neumorphism';
import { ButtonBase } from '@material-ui/core';
import styled, { css } from 'styled-components';

export const buttonBaseStyle = css`
  outline: none;

  border: 0;
  height: 42px;
  border-radius: 21px;

  cursor: pointer;

  user-select: none;

  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.actionButton.textColor};
`;

/**
 * Styled component of the `<ButtonBase />` of the Material-UI
 *
 * @see https://material-ui.com/api/button-base/
 */
export const ActionButton = styled(ButtonBase).attrs({ disableRipple: true })`
  ${buttonBaseStyle};

  background-color: ${({ theme }) => theme.actionButton.backgroundColor};

  &:hover {
    background-color: ${({ theme }) => theme.actionButton.backgroundHoverColor};
  }

  &:active {
    ${({ theme }) =>
      pressed({
        color: theme.actionButton.backgroundHoverColor,
        backgroundColor: theme.actionButton.backgroundHoverColor,
        distance: 1,
        intensity: theme.intensity,
      })};
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.3;
  }
`;
