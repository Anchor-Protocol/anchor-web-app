import { buttonBaseStyle } from '@libs/neumorphism-ui/components/ActionButton';
import { css } from 'styled-components';

export const ToolbarButtonStyle = css`
  ${buttonBaseStyle};

  display: inline-flex;
  gap: 2px;
  align-items: center;

  word-break: keep-all;
  white-space: nowrap;

  background-color: transparent;
  border: 1px solid transparent;

  height: auto;
  border-radius: 6px;

  font-size: 9px;
  color: ${({ theme }) => theme.colors.positive};

  svg {
    font-size: 1em;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.positive};
    border-color: ${({ theme }) => theme.colors.positive};
  }
`;
