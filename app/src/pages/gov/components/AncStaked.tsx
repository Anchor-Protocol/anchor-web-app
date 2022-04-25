import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { formatUTokenDecimal2 } from '@anchor-protocol/notation';
import { Rate, Token, u, UST } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import { BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import { ROUTES } from 'pages/trade/env';
import React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import { Link } from 'react-router-dom';

const Headline = () => {
  return (
    <p className="headline">
      <AnimateNumber format={formatUTokenDecimal2}>
        {1200000 as u<Token<BigSource>>}
      </AnimateNumber>{' '}
      <Sub>
        ANC{' '}
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
      {' ANC'}
    </p>
  );
};

const AncStakedBase = (props: UIElementProps) => {
  const { className } = props;

  const {
    target: { isNative },
  } = useDeploymentTarget();

  return (
    <Card className={className}>
      <h2>
        <IconSpan>
          TOTAL STAKED{' '}
          <InfoTooltip>
            Total quantity of ANC tokens staked to the governance contract
          </InfoTooltip>
        </IconSpan>
      </h2>
      <Headline />
      <Subline />

      <h2>
        <IconSpan>
          MY STAKED AMOUNT{' '}
          <InfoTooltip>
            Total quantity of your ANC tokens staked to the governance contract
          </InfoTooltip>
        </IconSpan>
      </h2>
      <Headline />
      <Subline />

      {isNative && (
        <div className="buttons">
          <Tooltip
            title="Stake ANC to enable vote locking or to obtain governance rewards"
            placement="top"
          >
            <BorderButton
              component={Link}
              to={`/${ROUTES.ANC_GOVERNANCE}/stake`}
            >
              Stake
            </BorderButton>
          </Tooltip>
          <Tooltip title="Partially or fully unstake your ANC" placement="top">
            <BorderButton
              component={Link}
              to={`/${ROUTES.ANC_GOVERNANCE}/unstake`}
            >
              Unstake
            </BorderButton>
          </Tooltip>
        </div>
      )}
    </Card>
  );
};

export const AncStaked = styled(AncStakedBase)`
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

  .buttons {
    margin-top: 84px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }
`;
