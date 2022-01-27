import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface CenteredTitleLayoutProps {
  className?: string;
  title: string;
  children: ReactNode;
}

function Component({ className, title, children }: CenteredTitleLayoutProps) {
  return (
    <div className={className}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

const StyledComponent = styled(Component)`
  max-width: 1440px;
  margin: 0 auto;

  > h1 {
    margin-top: 60px;
    padding: 0 20px;

    font-size: 44px;
    font-weight: 900;
    line-height: 1.2;
    letter-spacing: -0.3px;
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    > h1 {
      margin-top: 40px;
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    > h1 {
      margin-top: 20px;

      font-size: 34px;
    }
  }
`;

export const CenteredTitleLayout = fixHMR(StyledComponent);
