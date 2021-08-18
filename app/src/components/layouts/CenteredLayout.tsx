import { Footer } from 'components/Footer';
import { BODY_MARGIN_TOP, screen } from 'env';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface CenteredLayoutProps {
  className?: string;
  maxWidth?: number;
  children: ReactNode;
}

const defaultMaxWidth: number = 980;

function CenteredLayoutBase({ className, children }: CenteredLayoutProps) {
  return (
    <div className={className}>
      <main>
        <div className="content-layout">
          {children}
          <Footer style={{ margin: '60px 0' }} />
        </div>
      </main>
    </div>
  );
}

export const CenteredLayout = styled(CenteredLayoutBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  main {
    .content-layout {
      max-width: ${({ maxWidth = defaultMaxWidth }) => maxWidth}px;
      margin: 0 auto;
      padding: 0 20px;
      border-radius: 30px;
    }
  }

  // pc
  @media (min-width: ${screen.pc.min}px) {
    main {
      padding-top: ${BODY_MARGIN_TOP.pc}px;
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    main {
      padding-top: ${BODY_MARGIN_TOP.tablet}px;
    }

    .NeuSection-root {
      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    main {
      padding-top: ${BODY_MARGIN_TOP.mobile}px;
    }

    .NeuSection-root {
      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;
