import { AnimateNumber, UIElementProps } from '@libs/ui';
import { Divider } from 'components/primitives/Divider';
import React from 'react';
import styled from 'styled-components';
import { CardSubHeading, CardSubHeadingProps } from './Card';
import { formatUTokenDecimal2 } from '@anchor-protocol/notation';
import { ANC, u, veANC } from '@anchor-protocol/types';
import { Sub } from 'components/Sub';
import { useBalances } from 'contexts/balances';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { ROUTES } from 'pages/trade/env';
import { Link } from 'react-router-dom';
import {
  useMyAncStakedQuery,
  useMyVotingLockPeriodEndsAtQuery,
  useMyVotingPowerQuery,
} from 'queries';
import { BigSource } from 'big.js';
import { ExtendAncLockPeriod } from './ExtendAncLockPeriod';
import { formatTimestamp } from '@libs/formatter';
import { HStack, VStack } from '@libs/ui/Stack';
import { TitledCard } from '@libs/ui/cards/TitledCard';
import { ImportantStatistic } from '@libs/ui/text/ImportantStatistic';

interface LabelWithValueProps extends CardSubHeadingProps {}

const LabelWithValue = (props: LabelWithValueProps) => {
  const { title, tooltip, children } = props;

  return (
    <>
      <CardSubHeading className="subHeading" title={title} tooltip={tooltip} />
      <Amount>{children}</Amount>
    </>
  );
};

export const MyAncTokenOverview = (props: UIElementProps) => {
  const { uANC } = useBalances();

  const { data: staked } = useMyAncStakedQuery();

  const { data: votingPower } = useMyVotingPowerQuery();

  const { data: unlockAt } = useMyVotingLockPeriodEndsAtQuery();

  return (
    <TitledCard title="My ANC">
      <VStack fullWidth gap={40}>
        <HStack gap={60}>
          <ImportantStatistic
            name="balance"
            value={
              <>
                <AnimateNumber format={formatUTokenDecimal2}>
                  {uANC}
                </AnimateNumber>{' '}
                <Sub>ANC</Sub>
              </>
            }
          />
          <ImportantStatistic
            name="staking"
            value={
              <>
                <AnimateNumber format={formatUTokenDecimal2}>
                  {staked ? staked : (0 as u<ANC<BigSource>>)}
                </AnimateNumber>{' '}
                <Sub>ANC</Sub>
              </>
            }
          />
        </HStack>
        <HStack fullWidth>
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
        </HStack>
        <Divider />
        {unlockAt && (
          <LabelWithValue
            title="Unlock time"
            tooltip="The amount of ANC held in your Wallet"
          >
            {formatTimestamp(unlockAt)}
          </LabelWithValue>
        )}
        <LabelWithValue
          title="Voting Power"
          tooltip="The amount of ANC that you are currently Staking in the Governance contract"
        >
          <AnimateNumber format={formatUTokenDecimal2}>
            {votingPower ? votingPower : (0 as u<veANC<BigSource>>)}
          </AnimateNumber>{' '}
          <Sub>veANC</Sub>
        </LabelWithValue>
        <HStack fullWidth>
          <ExtendAncLockPeriod />
        </HStack>
      </VStack>
    </TitledCard>
  );
};

export const Amount = styled.p`
  font-size: 32px;
  font-weight: 500;

  span:last-child {
    margin-left: 8px;
    font-size: 0.55em;
  }
`;
