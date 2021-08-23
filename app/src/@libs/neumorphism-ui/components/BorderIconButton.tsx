import React from 'react';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styled from 'styled-components';

export interface BorderIconButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size: `${number}%` | `${number}px` | `${number}em`;
}

function BorderIconButtonBase({ size, ...buttonProps }: BorderIconButtonProps) {
  return <button {...buttonProps} />;
}

export const BorderIconButton = styled(BorderIconButtonBase)`
  background-color: transparent;
  outline: none;

  cursor: pointer;

  border-radius: 50%;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  padding: 0;

  color: ${({ theme }) => theme.borderButton.textColor};

  border: 1px solid ${({ theme }) => theme.borderButton.borderColor};

  &:hover {
    border: 1px solid ${({ theme }) => theme.borderButton.borderHoverColor};
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }

  svg {
    font-size: 1.2em;
    transform: translateY(0.1em);
  }
`;
