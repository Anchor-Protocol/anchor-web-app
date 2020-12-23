import { concave, flat } from '@anchor-protocol/styled-neumorphism';
import { ButtonBase } from '@material-ui/core';
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
      distance: 1,
      intensity: theme.intensity,
    })};

  &:hover {
    ${({ theme }) =>
      flat({
        color: theme.backgroundColor,
        distance: 5,
        intensity: theme.intensity,
      })};
  }

  &:active {
    ${({ theme }) =>
      concave({
        color: theme.backgroundColor,
        distance: 2,
        intensity: theme.intensity,
      })};
  }
`;
