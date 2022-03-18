import {
  APY,
  BorrowAPR,
  BorrowValue,
  CollateralValue,
} from '@anchor-protocol/icons';
import {
  formatUST,
  formatUSTWithPostfixUnits,
  MILLION,
} from '@anchor-protocol/notation';
import { demicrofy, formatRate, MICRO } from '@libs/formatter';
import { IconCircle } from '@libs/neumorphism-ui/components/IconCircle';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TooltipIconCircle } from '@libs/neumorphism-ui/components/TooltipIconCircle';
import { AnimateNumber } from '@libs/ui';
import { SubAmount } from 'components/primitives/SubAmount';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import { LoanButtons } from 'pages/borrow/components/LoanButtons';
import React from 'react';
import styled from 'styled-components';
import { useBorrowOverviewData } from '../logics/useBorrowOverviewData';
import { BorrowUsageGraph } from './BorrowUsageGraph';

export interface OverviewProps {
  className?: string;
}

function Component({ className }: OverviewProps) {
  const {
    borrowAPR,
    borrowedValue,
    collateralValue,
    borrowLimit,
    netAPR,
    currentLtv,
    //dangerLtv,
    borrowerDistributionAPYs,
  } = useBorrowOverviewData();

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <header>
        <h2>POSITION MANAGEMENT</h2>
        <div className="loan-buttons">
          <LoanButtons />
        </div>
      </header>

      <article>
        <div>
          <h3>
            <IconSpan>
              COLLATERAL VALUE{' '}
              <InfoTooltip>
                The sum of all collaterals deposited by the user, in USD
              </InfoTooltip>
            </IconSpan>
          </h3>
          <div className="value">
            $
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {demicrofy(collateralValue)}
            </AnimateNumber>
            {collateralValue.gt(MILLION * MICRO) && (
              <SubAmount style={{ fontSize: '15px' }}>
                <AnimateNumber format={formatUST}>
                  {demicrofy(collateralValue)}
                </AnimateNumber>{' '}
                UST
              </SubAmount>
            )}
          </div>
          <div>
            <CircleOnly>
              <IconCircle>
                <CollateralValue />
              </IconCircle>
            </CircleOnly>
          </div>
        </div>

        <div>
          <h3>
            <IconSpan>
              BORROWED VALUE{' '}
              <InfoTooltip>
                The sum of all loans borrowed by the user, in USD
              </InfoTooltip>
            </IconSpan>
          </h3>
          <div className="value">
            $
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {demicrofy(borrowedValue)}
            </AnimateNumber>
            {borrowedValue.gt(MILLION * MICRO) && (
              <SubAmount style={{ fontSize: '15px' }}>
                <AnimateNumber format={formatUST}>
                  {demicrofy(borrowedValue)}
                </AnimateNumber>{' '}
                UST
              </SubAmount>
            )}
          </div>
          <div>
            <LabelAndCircle>
              <p>
                <IconSpan>
                  Borrowed:{' '}
                  {formatUSTWithPostfixUnits(demicrofy(borrowedValue))} UST{' '}
                  <InfoTooltip>
                    The borrow amount for this specific stablecoin
                  </InfoTooltip>
                </IconSpan>
              </p>
              <IconCircle>
                <BorrowValue />
              </IconCircle>
            </LabelAndCircle>
          </div>
        </div>

        <div className="apy">
          <h3>
            <IconSpan>
              NET APR{' '}
              <InfoTooltip>
                Distribution APR - Borrow APR. When the net APR is a positive
                number, ANC rewards distributed to borrowers are greater than
                the interest to be paid for the loan
              </InfoTooltip>
            </IconSpan>
          </h3>
          <div className="value">
            <AnimateNumber format={formatRate}>{netAPR}</AnimateNumber> %
          </div>
          <div>
            <Circles>
              <div>
                <TooltipIconCircle
                  style={{ cursor: 'help' }}
                  title="The annualized rate of current interest on loans in USD"
                  placement="top"
                >
                  <BorrowAPR />
                </TooltipIconCircle>
                <p>
                  Borrow APR
                  <b>{formatRate(borrowAPR)}%</b>
                </p>
              </div>
              <div>
                <TooltipIconCircle
                  style={{ cursor: 'help' }}
                  title="Annual percentage yield determined by ANC rewards given to borrowers where the principal is taken to be the loan amount"
                  placement="top"
                >
                  <APY />
                </TooltipIconCircle>
                <p>
                  Distribution APR
                  <b>
                    {borrowerDistributionAPYs &&
                    borrowerDistributionAPYs.length > 0
                      ? formatRate(borrowerDistributionAPYs[0].DistributionAPY)
                      : 0}
                    %
                  </b>
                </p>
              </div>
            </Circles>
          </div>
        </div>
      </article>

      {currentLtv && borrowLimit ? (
        <figure>
          <h3>
            <IconSpan>
              BORROW USAGE{' '}
              <InfoTooltip>
                The percentage of the borrow limit used. The borrow limit and
                usage may fluctuate depending on the collateral value.
              </InfoTooltip>
            </IconSpan>
          </h3>
          <BorrowUsageGraph currentLtv={currentLtv} borrowLimit={borrowLimit} />
        </figure>
      ) : null}
    </Section>
  );
}

export const CircleOnly = styled.div`
  text-align: right;
`;

export const Circles = styled.div`
  display: flex;

  margin-left: -20px;
  margin-right: -30px;

  > div {
    flex: 1;

    display: flex;
    align-items: center;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    word-break: keep-all;
    white-space: nowrap;

    b {
      display: block;
      color: ${({ theme }) => theme.textColor};
    }

    > :nth-child(odd) {
      margin-right: 10px;
    }

    > :nth-child(even) {
      line-height: 18px;
    }
  }

  @media (max-width: 1400px) {
    margin-left: 0;
    margin-right: 0;
  }

  @media (max-width: ${screen.mobile.max}px) {
    flex-direction: column;

    > :last-child {
      margin-top: 10px;
    }
  }
`;

export const LabelAndCircle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.dimTextColor};
  font-size: 13px;
`;

const StyledComponent = styled(Component)`
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 16px;

    h2 {
      flex: 1;

      font-size: 12px;
      font-weight: 500;
    }

    .loan-buttons {
      display: flex;
      gap: 16px;

      button {
        width: 180px;
      }
    }

    margin-bottom: 60px;
  }

  article,
  figure {
    h3 {
      font-size: 12px;
      font-weight: 500;
    }
  }

  figure {
    h3 {
      margin-bottom: 20px;
    }
  }

  article {
    margin-bottom: 44px !important;
  }

  article > div {
    background: ${({ theme }) =>
      theme.palette.type === 'light' ? '#fcfcfc' : '#262940'};
    box-shadow: 0 8px 14px -8px rgba(0, 0, 0, 0.07);
    border-radius: 22px;
    padding: 35px 40px;
    height: auto;

    display: grid;
    grid-template-rows: 30px 84px 1fr;

    .value {
      font-size: 32px;
      font-weight: 500;
    }

    &.apy {
      color: ${({ theme }) => theme.colors.primary};

      .value {
        font-weight: 500;
      }
    }
  }

  @media (max-width: 700px) {
    header {
      flex-direction: column;
      justify-content: start;
      align-items: start;

      .loan-buttons {
        width: 100%;

        button {
          flex: 1;
        }
      }

      margin-bottom: 30px;
    }
  }

  @media (max-width: ${screen.mobile.max}px) {
    article > div {
      padding: 20px;
    }
  }
`;

export const Overview = fixHMR(StyledComponent);
