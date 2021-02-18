import { ReactNode } from 'react';
import styled from 'styled-components';

export interface BorderIconButtonProps {
  className?: string;
  size: `${number}%` | `${number}px` | `${number}em`;
  children: ReactNode;
}

function BorderIconButtonBase({ className, children }: BorderIconButtonProps) {
  return <button className={className}>{children}</button>;
}

export const BorderIconButton = styled(BorderIconButtonBase)`
  background-color: transparent;
  outline: none;

  border-radius: 50%;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  padding: 0;

  color: ${({ theme }) => theme.borderButton.textColor};

  border: 1px solid ${({ theme }) => theme.borderButton.borderColor};

  &:hover {
    border: 1px solid ${({ theme }) => theme.borderButton.borderHoverColor};
  }

  svg {
    font-size: 1.2em;
    transform: translateY(0.1em);
  }
`;
