import { CenteredLayout } from 'components/layouts/CenteredLayout';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface FormLayoutProps {
  className?: string;
  children: ReactNode;
}

function FormLayoutBase({ className, children }: FormLayoutProps) {
  return <CenteredLayout className={className}>{children}</CenteredLayout>;
}

export const FormLayout = styled(FormLayoutBase)`
  h1 {
    text-align: center;
    font-size: 27px;
    font-weight: 500;

    margin-bottom: 60px;
  }

  .description {
    font-size: 12px;

    &:not(:first-child) {
      margin-top: 20px;
    }

    margin-bottom: 10px;

    &[aria-disabled='true'] {
      opacity: 0.3;
    }
  }

  .MuiTextField-root {
    width: 100%;
  }

  .receipt {
    margin-top: 30px;
  }

  .wallet {
    margin-top: 5px;

    display: flex;
    justify-content: space-between;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    &[aria-invalid='true'] {
      color: ${({ theme }) => theme.colors.negative};
    }
  }

  .proceed {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
