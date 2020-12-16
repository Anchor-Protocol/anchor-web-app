import { pressed } from '@ssen/styled-neumorphism';
import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface TextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

function TextInputBase({ type = 'text', ...inputProps }: TextInputProps) {
  return <input {...inputProps} type={type} />;
}

export const TextInput = styled(TextInputBase)`
  outline: none;
  border: 0;
  padding: 20px;
  border-radius: 5px;

  font-family: Gotham;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => theme.textInput.textColor};

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity * 2,
    })};
`;
