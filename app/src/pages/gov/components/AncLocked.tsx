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
import React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import { Link } from 'react-router-dom';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { ROUTES } from 'pages/trade/env';

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

  const {
    target: { isNative },
  } = useDeploymentTarget();

  return (
    <Card className={className}>
      <h2>VOTE LOCKING</h2>

      <h3>
        <IconSpan>
          TOTAL LOCKED{' '}
          <InfoTooltip>
            Total quantity of veANC tokens staked to the governance contract
          </InfoTooltip>
        </IconSpan>
      </h3>
      <Headline />
      <Subline />

      <h3>
        <IconSpan>
          MY LOCKED AMOUNT{' '}
          <InfoTooltip>
            Total quantity of your veANC tokens staked to the governance
            contract
          </InfoTooltip>
        </IconSpan>
      </h3>
      <Headline />
      <Subline />

      {isNative && (
        <div className="buttons">
          <Tooltip
            title="Lock ANC to obtain veANC to participate in governance or gauge weight voting"
            placement="top"
          >
            <BorderButton
              component={Link}
              to={`/${ROUTES.ANC_GOVERNANCE}/lock`}
            >
              Lock
            </BorderButton>
          </Tooltip>
          <Tooltip
            title="Partially or fully unstake your veANC"
            placement="top"
          >
            <BorderButton
              component={Link}
              to={`/${ROUTES.ANC_GOVERNANCE}/unlock`}
            >
              Unlock
            </BorderButton>
          </Tooltip>
        </div>
      )}
    </Card>
  );
};

export const AncLocked = styled(AncLockedBase)`
  .NeuSectionContent {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 40px;
  }

  h3 {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  h3:not(:first-of-type) {
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
    flex-grow: 1;
    align-content: flex-end;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }
`;
