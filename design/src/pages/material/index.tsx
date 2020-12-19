import { ButtonBase, TextField } from '@material-ui/core';
import { concave, flat, pressed } from '@ssen/styled-neumorphism';
import { mediaQuery } from 'components/layout/mediaQuery';
import { Section } from 'components/ui/Section';
import React from 'react';
import styled, { css } from 'styled-components';

export interface MaterialUIProps {
  className?: string;
}

function MaterialUIBase({ className }: MaterialUIProps) {
  return (
    <div className={className}>
      <Section className="components">
        <div style={{marginBottom: 80}}>
          <Button2>Hello</Button2>
        </div>

        <div>
          <Input2 label="Text" />
        </div>
      </Section>
    </div>
  );
}

export const Input2 = styled(TextField)`
  border-radius: 5px;

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity * 2,
    })};
  
  .MuiFormLabel-root {
    opacity: 0.3;
  }
  
  .MuiFormLabel-root.Mui-focused {
    opacity: 1;
    color: ${({ theme }) => theme.textInput.textColor};
  }
  
  .MuiInputLabel-formControl {
    transform: translate(20px, 26px) scale(1);
  }
  
  .MuiInputLabel-shrink {
    transform: translate(20px, -22px) scale(0.9);
  }
  
  .MuiInput-root {
    margin: 20px 5px 20px 20px;
  }

  .MuiInput-underline:before,
  .MuiInput-underline:after {
    display: none;
  }
`;

export const buttonBaseStyle = css`
  outline: none;

  border: 0;
  height: 42px;
  border-radius: 21px;

  cursor: pointer;

  user-select: none;

  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.39;
  letter-spacing: normal;
  text-align: center;
  color: ${({ theme }) => theme.actionButton.textColor};
`;

const Button2 = styled(ButtonBase).attrs({
  disableRipple: true,
  disableTouchRipple: true,
})`
  padding: 10px 100px;

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

export const MaterialUI = styled(MaterialUIBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};

  margin-bottom: 1px;

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .components {
  }

  // pc
  @media (${mediaQuery.pc}) {
    padding: 100px;

    .components {
      padding: 50px;
    }
  }

  // tablet
  @media (${mediaQuery.tablet}) {
    padding: 30px;

    .components {
      padding: 30px;
    }
  }

  // mobile
  @media (${mediaQuery.mobile}) {
    padding: 30px 20px;

    .components {
      padding: 20px;
    }
  }
`;
