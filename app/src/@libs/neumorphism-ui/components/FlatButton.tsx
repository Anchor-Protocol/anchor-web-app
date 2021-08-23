import { ButtonBase } from '@material-ui/core';
import styled from 'styled-components';
import { buttonBaseStyle } from './ActionButton';

/**
 * Styled component of the `<ButtonBase />` of the Material-UI
 *
 * @see https://material-ui.com/api/button-base/
 */
export const FlatButton = styled(ButtonBase).attrs({ disableRipple: true })`
  ${buttonBaseStyle};

  background-color: ${({ theme }) => theme.actionButton.backgroundColor};

  &:hover {
    background-color: ${({ theme }) => theme.actionButton.backgroundHoverColor};
  }

  &:disabled {
    opacity: 0.3;
  }
`;
