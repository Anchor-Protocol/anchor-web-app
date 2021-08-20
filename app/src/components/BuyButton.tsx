import { buttonBaseStyle } from '@terra-dev/neumorphism-ui/components/ActionButton';
import styled, { css } from 'styled-components';

const buyButtonStyle = css`
  ${buttonBaseStyle};

  display: inline-flex;
  gap: 2px;
  align-items: center;

  word-break: keep-all;
  white-space: nowrap;

  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.hoverBackgroundColor};

  height: 1.77777778em;
  border-radius: 6px;

  font-size: 9px;
  color: ${({ theme }) => theme.colors.positive};

  transform: translateY(-1.5px);

  svg {
    font-size: 1em;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.positive};
    border-color: ${({ theme }) => theme.colors.positive};
  }
`;

export const BuyButton = styled.button`
  ${buyButtonStyle};

  padding: 0 8px 1px 8px;
`;

export const BuyLink = styled.a`
  ${buyButtonStyle};

  padding: 0 8px 1px 8px;

  text-decoration: none;
`;
