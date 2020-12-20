import { pressed } from '@anchor-protocol/styled-neumorphism';
import { TextField, TextFieldProps } from '@material-ui/core';
import { ComponentType } from 'react';
import styled from 'styled-components';

export const TextInput: ComponentType<TextFieldProps> = styled(TextField)`
  border-radius: 5px;

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity * 2,
    })};

  .MuiFormLabel-root {
    opacity: 1;
    color: ${({ theme }) => theme.formControl.labelColor};
  }

  .MuiFormLabel-root.Mui-focused {
    opacity: 1;
    color: ${({ theme }) => theme.formControl.labelFocusedColor};
  }

  .MuiFormLabel-root.Mui-error {
    color: ${({ theme }) => theme.formControl.labelErrorColor};
  }

  .MuiInputLabel-formControl {
    transform: translate(20px, 26px) scale(1);
  }

  .MuiInputLabel-shrink {
    transform: translate(20px, -22px) scale(0.9);
  }

  .MuiInput-root {
    margin: 20px;
    color: ${({ theme }) => theme.textInput.textColor};
  }

  .MuiInput-root.Mui-error {
    color: ${({ theme }) => theme.formControl.labelErrorColor};
  }

  .MuiInput-underline:before,
  .MuiInput-underline:after {
    display: none;
  }
`;
