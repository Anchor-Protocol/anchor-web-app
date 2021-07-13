import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface BorrowedValueProps {
  className?: string;
}

function BorrowedValueBase({ className }: BorrowedValueProps) {
  const { ref, width = 400 } = useResizeObserver();

  const isSmallLayout = useMemo(() => {
    return width < 470;
  }, [width]);

  return (
    <Section className={className} data-small-layout={isSmallLayout}>
      <header ref={ref}>
        <div>
          <h4>Borrowed Value</h4>
          <p>
            93,238.03<span> UST</span>
          </p>
        </div>
        <div>
          <BorderButton component={Link} to="/borrow">
            Manage
          </BorderButton>
        </div>
      </header>

      <div className="net-apr">
        <h5>Net APR</h5>
        <p>184.92%</p>
      </div>
    </Section>
  );
}

export const StyledBorrowedValue = styled(BorrowedValueBase)`
  header {
    display: flex;
    justify-content: space-between;

    h4 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    p {
      font-size: clamp(20px, 8vw, 36px);
      font-weight: 500;

      span {
        font-size: 20px;
      }
    }

    a {
      font-size: 14px;
      padding: 0 13px;
      height: 32px;

      svg {
        font-size: 1em;
        margin-right: 0.3em;
      }
    }
  }

  .net-apr {
    margin-top: 40px;

    h5 {
      font-size: 13px;
      font-weight: 500;
    }

    p {
      margin-top: 6px;

      font-size: 28px;
      font-weight: 500;

      span {
        font-size: 13px;
      }
    }
  }

  &[data-small-layout='true'] {
    header {
      flex-direction: column;

      button {
        margin-top: 1em;

        width: 100%;
      }
    }
  }
`;

export const BorrowedValue = fixHMR(StyledBorrowedValue);
