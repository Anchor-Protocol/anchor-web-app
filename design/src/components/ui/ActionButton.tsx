import { concave, flat } from '@ssen/styled-neumorphism';
import styled, { css } from 'styled-components';

export const buttonBaseStyle = css`
  outline: none;

  border: 0;
  height: 42px;
  border-radius: 21px;
  
  cursor: pointer;

  user-select: none;
  
  font-family: Gotham;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.39;
  letter-spacing: normal;
  text-align: center;
  color: ${({ theme }) => theme.actionButton.textColor};
`;

export const ActionButton = styled.button`
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
`;
