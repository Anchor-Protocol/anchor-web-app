import { formatUTokenDecimal2 } from '@anchor-protocol/notation';
import { Rate, Token, u, UST } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import { BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import React from 'react';
import styled from 'styled-components';
import { OverviewCard } from './OverviewCard';

const Headline = () => {
  return (
    <p className="headline">
      <AnimateNumber format={formatUTokenDecimal2}>
        {1200000 as u<Token<BigSource>>}
      </AnimateNumber>{' '}
      <Sub>
        veANC{' '}
        <span>
          (
          <AnimateNumber format={formatRate}>
            {0.37 as Rate<BigSource>}
          </AnimateNumber>
          %)
        </span>
      </Sub>
    </p>
  );
};

const Subline = () => {
  return (
    <p className="subline">
      <AnimateNumber format={formatUTokenDecimal2}>
        {123456789 as u<UST<number>>}
      </AnimateNumber>
      {' veANC'}
    </p>
  );
};

const AncLockedBase = (props: UIElementProps) => {
  const { className } = props;

  return (
    <OverviewCard className={className}>
      <h2>
        <IconSpan>
          TOTAL LOCKED{' '}
          <InfoTooltip>
            Total quantity of veANC tokens staked to the governance contract
          </InfoTooltip>
        </IconSpan>
      </h2>
      <Headline />
      <Subline />

      <h2>
        <IconSpan>
          MY LOCKED AMOUNT{' '}
          <InfoTooltip>
            Total quantity of your veANC tokens staked to the governance
            contract
          </InfoTooltip>
        </IconSpan>
      </h2>
      <Headline />
      <Subline />
    </OverviewCard>
  );
};

export const AncLocked = styled(AncLockedBase)`
  h2:not(:first-of-type) {
    margin-top: 40px;
  }

  .headline {
    font-size: 32px;
    font-weight: 500;

    sub {
      font-size: 18px;
      vertical-align: baseline;
      span {
        color: ${({ theme }) => theme.dimTextColor};
      }
    }
  }

  .subline {
    margin-top: 7px;
    font-size: 13px;
    font-weight: normal;
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
