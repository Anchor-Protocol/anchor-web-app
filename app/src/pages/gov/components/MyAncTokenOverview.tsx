import { AnimateNumber, UIElementProps } from '@libs/ui';
import { Divider } from 'components/primitives/Divider';
import React from 'react';
import styled from 'styled-components';
import { Card, CardHeading, CardSubHeading, CardSubHeadingProps } from './Card';
import { formatUTokenDecimal2 } from '@anchor-protocol/notation';
import { Token, u } from '@anchor-protocol/types';
import { Sub } from 'components/Sub';
import { useBalances } from 'contexts/balances';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { ROUTES } from 'pages/trade/env';
import { Link } from 'react-router-dom';

interface ValueProps extends CardSubHeadingProps {}

const Value = (props: ValueProps) => {
  const { title, tooltip, children } = props;

  return (
    <>
      <CardSubHeading className="subHeading" title={title} tooltip={tooltip} />
      <p className="amount">{children}</p>
    </>
  );
};

const MyAncTokenOverviewBase = (props: UIElementProps) => {
  const { className } = props;

  const { uANC } = useBalances();

  return (
    <Card className={className}>
      <CardHeading title="My ANC" />
      <section>
        <Value title="Balance" tooltip="The amount of ANC held in your Wallet">
          <AnimateNumber format={formatUTokenDecimal2}>{uANC}</AnimateNumber>{' '}
          <Sub>ANC</Sub>
        </Value>
        <Value
          title="Staking"
          tooltip="The amount of ANC that you are currently Staking in the Governance contract"
        >
          <AnimateNumber format={formatUTokenDecimal2}>
            {123456789 as u<Token<number>>}
          </AnimateNumber>{' '}
          <Sub>ANC</Sub>
        </Value>
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
      </section>
      <Divider />
      <section>
        <Value
          title="Unlock time"
          tooltip="The amount of ANC held in your Wallet"
        >
          23/May/2022 14:33
        </Value>
        <Value
          title="Voting Power"
          tooltip="The amount of ANC that you are currently Staking in the Governance contract"
        >
          <AnimateNumber format={formatUTokenDecimal2}>
            {123456789 as u<Token<number>>}
          </AnimateNumber>{' '}
          <Sub>ANC</Sub>
        </Value>
        <div className="buttons">
          <Tooltip title="Partially or fully unstake your ANC" placement="top">
            <BorderButton
              component={Link}
              to={`/${ROUTES.ANC_GOVERNANCE}/unstake`}
            >
              Extend
            </BorderButton>
          </Tooltip>
        </div>
      </section>
    </Card>
  );
};

export const MyAncTokenOverview = styled(MyAncTokenOverviewBase)`
  height: 100%;

  hr {
    margin: 40px 0;
  }

  .subHeading {
    margin-top: 30px;
  }

  .amount {
    font-size: 32px;
    font-weight: 500;

    span:last-child {
      margin-left: 8px;
      font-size: 0.55em;
    }
  }

  .buttons {
    margin-top: 40px;
    flex-grow: 1;
    align-content: flex-end;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }
`;
