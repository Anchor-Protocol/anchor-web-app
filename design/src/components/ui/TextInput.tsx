import { pressed } from '@ssen/styled-neumorphism';
import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface TextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

function TextInputBase({
  className,
  type = 'text',
  ...inputProps
}: TextInputProps) {
  return (
    <div className={className}>
      <input {...inputProps} type={type} />
    </div>
  );
}

export const TextInput = styled(TextInputBase)`
  border-radius: 5px;

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity * 2,
    })};

  input {
    outline: none;
    border: 0;
    padding: 20px;
    background-color: transparent;
    width: 100%;

    font-family: Gotham;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${({ theme }) => theme.textInput.textColor};
  }
`;
