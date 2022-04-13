import { formatUTokenDecimal2 } from '@anchor-protocol/notation';
import { Rate, Token, u } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import { BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import React from 'react';
import styled from 'styled-components';
import { OverviewCard } from './OverviewCard';

const AncStakingCardBase = (props: UIElementProps) => {
  const { className } = props;

  return (
    <OverviewCard className={className}>
      <h2>
        <IconSpan>
          TOTAL STAKED{' '}
          <InfoTooltip>
            Total quantity of ANC tokens staked to the governance contract
          </InfoTooltip>
        </IconSpan>
      </h2>
      <div>
        <AnimateNumber format={formatUTokenDecimal2}>
          {12300000 as u<Token<BigSource>>}
        </AnimateNumber>{' '}
        <Sub>
          ANC{' '}
          <span>
            (
            <AnimateNumber format={formatRate}>
              {0.55 as Rate<BigSource>}
            </AnimateNumber>
            %)
          </span>
        </Sub>
      </div>

      <h2>
        <IconSpan>
          TOTAL STAKED{' '}
          <InfoTooltip>
            Total quantity of ANC tokens staked to the governance contract
          </InfoTooltip>
        </IconSpan>
      </h2>
      <div>
        <AnimateNumber format={formatUTokenDecimal2}>
          {12300000 as u<Token<BigSource>>}
        </AnimateNumber>{' '}
        <Sub>
          ANC{' '}
          <span>
            (
            <AnimateNumber format={formatRate}>
              {0.55 as Rate<BigSource>}
            </AnimateNumber>
            %)
          </span>
        </Sub>
      </div>

      <h2>
        <IconSpan>
          TOTAL STAKED{' '}
          <InfoTooltip>
            Total quantity of ANC tokens staked to the governance contract
          </InfoTooltip>
        </IconSpan>
      </h2>
      <div>
        <AnimateNumber format={formatUTokenDecimal2}>
          {12300000 as u<Token<BigSource>>}
        </AnimateNumber>{' '}
        <Sub>
          ANC{' '}
          <span>
            (
            <AnimateNumber format={formatRate}>
              {0.55 as Rate<BigSource>}
            </AnimateNumber>
            %)
          </span>
        </Sub>
      </div>
    </OverviewCard>
  );
};

export const AncStakingCard = styled(AncStakingCardBase)`
  h2:not(:first-of-type) {
    margin-top: 40px;
  }
`;
