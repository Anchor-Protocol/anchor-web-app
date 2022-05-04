import { Rate, Token, u } from '@anchor-protocol/types';
import { AnimateNumber } from '@libs/ui';
import React from 'react';
import { Circles } from 'components/primitives/Circles';
import { anc160gif, GifIcon, TokenIcon } from '@anchor-protocol/token-icons';
import {
  useAncLpStakingStateQuery,
  useBorrowAPYQuery,
  useDeploymentTarget,
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'pages/trade/env';
import Big from 'big.js';
import { demicrofy, formatRate, formatUTokenDecimal2 } from '@libs/formatter';
import { formatOutput } from '@anchor-protocol/formatter';
import { Sub } from 'components/Sub';
import { TitledCard } from '@libs/ui/cards/TitledCard';
import { HStack, VStack } from '@libs/ui/Stack';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { InlineStatistic } from '@libs/ui/text/InlineStatistic';

export const AncUstLp = () => {
  const navigate = useNavigate();

  const {
    target: { isNative },
  } = useDeploymentTarget();

  const onClick = isNative
    ? () => navigate(`/${ROUTES.ANC_UST_LP}/provide`)
    : undefined;

  const { data: { lpRewards } = {} } = useBorrowAPYQuery();

  const { data: ancUstLpRewards } = useRewardsAncUstLpRewardsQuery();

  const { data: { lpStakingState } = {} } = useAncLpStakingStateQuery();

  const ancRewards = ancUstLpRewards?.userLPPendingToken?.pending_on_proxy;
  const astroRewards = ancUstLpRewards?.userLPPendingToken?.pending;

  const hasAstroRewards = astroRewards && !Big(astroRewards).eq(0);
  const hasAncRewards = ancRewards && !Big(ancRewards).eq(0);

  return (
    <TitledCard
      title={
        <HStack alignItems="center" gap={24}>
          <Circles
            className="icon"
            backgroundColors={['#ffffff', '#2C2C2C']}
            radius={24}
          >
            <TokenIcon token="ust" style={{ fontSize: '1.1em' }} />
            <GifIcon
              src={anc160gif}
              style={{ fontSize: '2em', borderRadius: '50%' }}
            />
          </Circles>
          <p>ANC-UST LP</p>
        </HStack>
      }
    >
      <VStack fullHeight justifyContent="end" fullWidth gap={40}>
        <VStack fullWidth gap={12}>
          <InlineStatistic
            name="APR"
            kind="secondary"
            value={
              <>
                <AnimateNumber format={formatRate}>
                  {lpRewards && lpRewards.length > 0
                    ? lpRewards[0].apr
                    : (0 as Rate<number>)}
                </AnimateNumber>{' '}
                %
              </>
            }
          />
          <InlineStatistic
            name="Total staked"
            kind="secondary"
            value={
              <AnimateNumber format={formatUTokenDecimal2}>
                {lpStakingState?.total_bond_amount
                  ? lpStakingState.total_bond_amount
                  : (0 as u<Token<number>>)}
              </AnimateNumber>
            }
          />
          {hasAncRewards && (
            <InlineStatistic
              name="ANC Rewards"
              kind="secondary"
              value={
                <>
                  {formatOutput(demicrofy(ancRewards))} <Sub>ANC</Sub>
                </>
              }
            />
          )}
          {hasAstroRewards && (
            <InlineStatistic
              name="ASTRO Rewards"
              kind="secondary"
              value={
                <>
                  {formatOutput(demicrofy(astroRewards))} <Sub>ASTRO</Sub>
                </>
              }
            />
          )}
        </VStack>
        <BorderButton onClick={onClick}>ANC-UST LP Stake</BorderButton>
      </VStack>
    </TitledCard>
  );
};
