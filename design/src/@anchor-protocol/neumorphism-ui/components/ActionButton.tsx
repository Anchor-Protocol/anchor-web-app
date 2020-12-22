import { ButtonBase } from '@material-ui/core';
import { concave, flat } from '@anchor-protocol/styled-neumorphism';
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

export const ActionButton = styled(ButtonBase)`
  ${buttonBaseStyle};

  ${({ theme }) =>
    flat({
      color: theme.actionButton.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};

  &:hover {
    ${({ theme }) =>
      flat({
        color: theme.actionButton.backgroundColor,
        backgroundColor: theme.backgroundColor,
        distance: 5,
        intensity: theme.intensity,
      })};
  }

  &:active {
    ${({ theme }) =>
      concave({
        color: theme.actionButton.backgroundColor,
        backgroundColor: theme.backgroundColor,
        distance: 2,
        intensity: theme.intensity,
      })};
  }
  
  &:disabled {
    opacity: 0.3;
  }
`;
