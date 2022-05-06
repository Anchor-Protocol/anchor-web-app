import { AnimateNumber } from '@libs/ui';
import { Divider } from 'components/primitives/Divider';
import React from 'react';
import styled from 'styled-components';
import { formatUTokenDecimal2, formatVeAnc } from '@anchor-protocol/notation';
import { ANC, MillisTimestamp, u, veANC } from '@anchor-protocol/types';
import { demicrofy } from '@anchor-protocol/formatter';
import { Sub } from 'components/Sub';
import { useBalances } from 'contexts/balances';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { ROUTES } from 'pages/trade/env';
import { Link } from 'react-router-dom';
import {
  useMyVotingLockPeriodEndsAtQuery,
  useMyVotingPowerQuery,
} from 'queries';
import Big, { BigSource } from 'big.js';
import { ExtendAncLockPeriod } from './ExtendAncLockPeriod';
import { formatTimestamp } from '@libs/formatter';
import { HStack, VStack } from '@libs/ui/Stack';
import { TitledCard } from '@libs/ui/cards/TitledCard';
import { ImportantStatistic } from '@libs/ui/text/ImportantStatistic';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { InlineStatistic } from '@libs/ui/text/InlineStatistic';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { useMyAncStaked } from 'hooks';

export const MyAncTokenOverview = () => {
  const { uANC } = useBalances();

  const staked = useMyAncStaked() ?? (0 as u<ANC<number>>);

  const { data: votingPower = 0 as u<veANC<number>> } = useMyVotingPowerQuery();

  const { data: unlockAt } = useMyVotingLockPeriodEndsAtQuery();

  return (
    <TitledCard title="My ANC">
      <VStack fullWidth gap={40}>
        <HStack gap={60}>
          <ImportantStatistic
            name="wallet"
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
        <ManageStake>
          <Tooltip
            title="Stake ANC to enable vote locking or to obtain governance rewards"
            placement="top"
          >
            <ActionButton
              component={Link}
              to={`/${ROUTES.ANC_GOVERNANCE}/stake`}
            >
              Stake
            </ActionButton>
          </Tooltip>
          <Tooltip title="Partially or fully unstake your ANC" placement="top">
            <BorderButton
              component={Link}
              to={`/${ROUTES.ANC_GOVERNANCE}/unstake`}
            >
              Unstake
            </BorderButton>
          </Tooltip>
        </ManageStake>
        <Divider />
        <VotingPower
          staked={staked}
          votingPower={votingPower}
          unlockAt={unlockAt}
        />
      </VStack>
    </TitledCard>
  );
};

interface VotingPowerProps {
  staked: u<ANC<BigSource>>;
  votingPower: u<veANC<BigSource>>;
  unlockAt: MillisTimestamp | undefined;
}

const VotingPower = (props: VotingPowerProps) => {
  const { staked, votingPower, unlockAt } = props;

  if (Big(staked).lte(0) && Big(votingPower).lte(0)) {
    return (
      <NoVotingPower>
        <h4>No voting power</h4>
        <p>Stake &amp; lock your ANC to gain voting power for polls.</p>
      </NoVotingPower>
    );
  }

  if (Big(staked).gt(0) && Big(votingPower).lte(0)) {
    return (
      <>
        <VStack fullWidth gap={20}>
          <NoVotingPower>
            <h4>No voting power</h4>
            <p>
              Extend the lock period for your staked ANC to gain voting power
              for polls.
            </p>
          </NoVotingPower>
        </VStack>
        <HStack fullWidth gap={20}>
          <ExtendAncLockPeriod />
        </HStack>
      </>
    );
  }

  return (
    <>
      <VStack fullWidth gap={20}>
        {unlockAt !== undefined && (
          <InlineStatistic
            name="UNLOCK TIME"
            value={formatTimestamp(unlockAt)}
          />
        )}
        {votingPower !== undefined && (
          <InlineStatistic
            name="VOTING POWER"
            value={
              <>
                <AnimateNumber format={formatVeAnc}>
                  {votingPower
                    ? demicrofy(votingPower, 6)
                    : (0 as veANC<BigSource>)}
                </AnimateNumber>{' '}
                <Sub>{VEANC_SYMBOL}</Sub>
              </>
            }
          />
        )}
      </VStack>
      <HStack fullWidth>
        <ExtendAncLockPeriod />
      </HStack>
    </>
  );
};

const NoVotingPower = styled.div`
  h4 {
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  p {
    margin: 0;
  }
`;

const ManageStake = styled.div`
  display: grid;
  gap: 12px;
  width: 100%;
  grid-template-columns: 1fr 1fr;
`;