import { Footer } from 'components/Footer';
import { BODY_MARGIN_TOP, screen } from 'env';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface PaddedLayoutProps {
  className?: string;
  children: ReactNode;
}

function PaddedLayoutBase({ className, children }: PaddedLayoutProps) {
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

export const PaddedLayout = styled(PaddedLayoutBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  // pc
  @media (min-width: ${screen.pc.min}px) {
    padding: ${BODY_MARGIN_TOP.pc}px 100px 100px 100px;

    .NeuSection-root {
      margin-bottom: 40px;
    }
  }

  @media (min-width: ${screen.monitor.min}px) {
    main {
      max-width: ${screen.monitor.min}px;
      margin: 0 auto;
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    padding: ${BODY_MARGIN_TOP.tablet}px 30px 30px 30px;

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    padding: ${BODY_MARGIN_TOP.mobile}px 20px 30px 20px;

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;
