import {
  APY,
  BorrowAPR,
  BorrowValue,
  CollateralValue,
} from '@anchor-protocol/icons';
import {
  AnimateNumber,
  demicrofy,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useBorrowAPYQuery,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/webapp-provider';
import { IconCircle } from '@terra-dev/neumorphism-ui/components/IconCircle';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { TooltipIconCircle } from '@terra-dev/neumorphism-ui/components/TooltipIconCircle';
import big, { Big } from 'big.js';
import { screen } from 'env';
import { currentLtv as _currentLtv } from 'pages/borrow/logics/currentLtv';
import { useMemo } from 'react';
import styled from 'styled-components';
import { apr as _apr } from '../logics/apr';
import { borrowed as _borrowed } from '../logics/borrowed';
import { collaterals as _collaterals } from '../logics/collaterals';
import { BorrowLimitGraph } from './BorrowLimitGraph';
import { EstimatedAPR } from './EstimatedAPR';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  const {
    data: { borrowRate, oraclePrice, bLunaSafeLtv, bLunaMaxLtv } = {},
  } = useBorrowMarketQuery();

  const {
    data: { marketBorrowerInfo, custodyBorrower } = {},
  } = useBorrowBorrowerQuery();

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { data: { borrowerDistributionAPYs } = {} } = useBorrowAPYQuery();

  const currentLtv = useMemo(
    () =>
      marketBorrowerInfo && custodyBorrower && oraclePrice
        ? _currentLtv(marketBorrowerInfo, custodyBorrower, oraclePrice)
        : undefined,
    [custodyBorrower, marketBorrowerInfo, oraclePrice],
  );

  const apr = useMemo(() => _apr(borrowRate, blocksPerYear), [
    blocksPerYear,
    borrowRate,
  ]);

  const borrowed = useMemo(() => _borrowed(marketBorrowerInfo), [
    marketBorrowerInfo,
  ]);

  const collaterals = useMemo(
    () => _collaterals(custodyBorrower, oraclePrice?.rate),
    [custodyBorrower, oraclePrice?.rate],
  );

  return (
    <Section className={className}>
      <article>
        <div>
          <h3>
            <IconSpan>
              Collateral Value{' '}
              <InfoTooltip>
                The sum of all collaterals deposited by the user, in USD
              </InfoTooltip>
            </IconSpan>
          </h3>
          <div className="value">
            $
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {demicrofy(collaterals)}
            </AnimateNumber>
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
              Borrowed Value{' '}
              <InfoTooltip>
                The sum of all loans borrowed by the user, in USD
              </InfoTooltip>
            </IconSpan>
          </h3>
          <div className="value">
            $
            <AnimateNumber format={formatUSTWithPostfixUnits}>
              {demicrofy(borrowed)}
            </AnimateNumber>
          </div>
          <div>
            <LabelAndCircle>
              <p>
                <IconSpan>
                  Borrowed: {formatUSTWithPostfixUnits(demicrofy(borrowed))} UST{' '}
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
              Net APR{' '}
              <InfoTooltip>
                Distribution APR - Borrow APR. When the net APR is a positive
                number, ANC rewards distributed to borrowers are greater than
                the interest to be paid for the loan
              </InfoTooltip>
            </IconSpan>
          </h3>
          <div className="value">
            <AnimateNumber format={formatRate}>
              {borrowerDistributionAPYs && borrowerDistributionAPYs.length > 0
                ? (big(borrowerDistributionAPYs[0].DistributionAPY).minus(
                    apr,
                  ) as Rate<Big>)
                : (0 as Rate<number>)}
            </AnimateNumber>{' '}
            %
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
                  <b>{formatRate(apr)}%</b>
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
      <EstimatedAPR />
      </article>

      {currentLtv && bLunaSafeLtv && bLunaMaxLtv && marketBorrowerInfo && (
        <figure>
          <BorrowLimitGraph
            ltv={currentLtv}
            bLunaSafeLtv={bLunaSafeLtv}
            bLunaMaxLtv={bLunaMaxLtv}
            collateralValue={collaterals}
            loanAmount={marketBorrowerInfo.loan_amount}
          />
        </figure>
      )}
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

    font-size: 13px;
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

export const Overview = styled(OverviewBase)`
  article > div {
    background: ${({ theme }) =>
      theme.palette.type === 'light' ? '#fcfcfc' : '#262940'};
    box-shadow: 0 8px 14px -8px rgba(0, 0, 0, 0.07);
    border-radius: 22px;
    padding: 35px 40px;
    height: auto;

    display: grid;
    grid-template-rows: 20px 100px 1fr;

    h3 {
      font-size: 13px;
      font-weight: 500;
    }

    .value {
      font-size: 40px;
      font-weight: 300;
    }

    &.apy {
      color: ${({ theme }) => theme.colors.positive};

      .value {
        font-weight: 500;
      }
    }
  }

  @media (max-width: ${screen.mobile.max}px) {
    article > div {
      padding: 20px;
    }
  }
`;
