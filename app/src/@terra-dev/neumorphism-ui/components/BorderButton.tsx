import { ButtonBase } from '@material-ui/core';
import styled from 'styled-components';
import { buttonBaseStyle } from './ActionButton';

/**
 * Styled component of the `<ButtonBase />` of the Material-UI
 *
 * @see https://material-ui.com/api/button-base/
 */
export const BorderButton = styled(ButtonBase).attrs({ disableRipple: true })`
  ${buttonBaseStyle};

  color: ${({ theme }) => theme.borderButton.textColor};
  border: 1px solid ${({ theme }) => theme.borderButton.borderColor};

  &:hover {
    border: 1px solid ${({ theme }) => theme.borderButton.borderHoverColor};
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }

  &:disabled {
    opacity: 0.3;
  }
`;
