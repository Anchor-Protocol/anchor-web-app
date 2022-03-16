import React, { useMemo } from 'react';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, formatRate } from '@libs/formatter';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { Big, BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import { fixHMR } from 'fix-hmr';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { BorrowUsageGraph } from 'pages/borrow/components/BorrowUsageGraph';

export interface BorrowedValueProps {
  className?: string;
  borrowedValue: u<UST<Big>>;
  netAPR: Rate<BigSource>;
  currentLtv: Rate<Big> | undefined;
  dangerLtv: Rate<Big> | undefined;
  borrowLimit: u<UST<Big>> | undefined;
}

function BorrowedValueBase({
  className,
  borrowedValue,
  borrowLimit,
  currentLtv,
  dangerLtv,
  netAPR,
}: BorrowedValueProps) {
  const { ref, width = 400 } = useResizeObserver();

  const isSmallLayout = useMemo(() => {
    return width < 470;
  }, [width]);

  return (
    <Section className={className} data-small-layout={isSmallLayout}>
      <header ref={ref}>
        <div>
          <h4>
            <IconSpan>
              BORROWED VALUE{' '}
              <InfoTooltip>The total value borrowed from Anchor</InfoTooltip>
            </IconSpan>
          </h4>
          <p>
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {demicrofy(borrowedValue)}
            </AnimateNumber>
            <Sub> UST</Sub>
          </p>
        </div>
        <div>
          <BorderButton component={Link} to="/borrow">
            Manage
          </BorderButton>
        </div>
      </header>

      <div className="net-apr">
        <h5>
          <IconSpan>
            Net APR{' '}
            <InfoTooltip>
              Distribution APR - Borrow APR. When the net APR is a positive
              number, ANC rewards distributed to borrowers are greater than the
              interest to be paid for the loan
            </InfoTooltip>
          </IconSpan>
        </h5>
        <p>{formatRate(netAPR)}%</p>
      </div>

      {currentLtv && dangerLtv && borrowLimit && (
        <figure>
          <BorrowUsageGraph currentLtv={currentLtv} borrowLimit={borrowLimit} />
        </figure>
      )}
    </Section>
  );
}

export const StyledBorrowedValue = styled(BorrowedValueBase)`
  min-height: 400px;

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

      sub {
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

      sub {
        font-size: 13px;
      }
    }

    margin-bottom: 100px;
  }

  &[data-small-layout='true'] {
    header {
      flex-direction: column;

      a {
        margin-top: 1em;

        width: 100%;
      }
    }
  }
`;

export const BorrowedValue = fixHMR(StyledBorrowedValue);
