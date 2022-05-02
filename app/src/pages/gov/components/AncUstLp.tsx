import { Rate, Token, u } from '@anchor-protocol/types';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ButtonCard } from './ButtonCard';
import { Circles } from 'components/primitives/Circles';
import { anc160gif, GifIcon, TokenIcon } from '@anchor-protocol/token-icons';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import {
  useAncLpStakingStateQuery,
  useBorrowAPYQuery,
  useDeploymentTarget,
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'pages/trade/env';
import { CardHeading } from './Card';
import Big from 'big.js';
import { demicrofy, formatRate, formatUTokenDecimal2 } from '@libs/formatter';
import { formatOutput } from '@anchor-protocol/formatter';

interface LabelWithValueProps {
  label: string;
  tooltip: string;
  children: ReactNode;
}

const LabelWithValue = (props: LabelWithValueProps) => {
  const { label, tooltip, children } = props;
  return (
    <div className="value">
      <TooltipLabel title={tooltip} placement="top">
        {label}
      </TooltipLabel>
      <p>{children}</p>
    </div>
  );
};

const AncUstLpBase = (props: UIElementProps) => {
  const { className } = props;

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
  const hasRewards = hasAstroRewards || hasAncRewards;

  return (
    <ButtonCard onClick={onClick}>
      <div className={className}>
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
        <CardHeading className="heading" title="ANC-UST LP" />
        <div className="values">
          {hasRewards && (
            <LabelWithValue label="Rewards" tooltip="Your pending rewards">
              {hasAncRewards && (
                <div>{formatOutput(demicrofy(ancRewards))} ANC</div>
              )}
              {hasAstroRewards && (
                <div>{formatOutput(demicrofy(astroRewards))} ASTRO</div>
              )}
            </LabelWithValue>
          )}
          <LabelWithValue label="APR" tooltip="APR">
            <AnimateNumber format={formatRate}>
              {lpRewards && lpRewards.length > 0
                ? lpRewards[0].apr
                : (0 as Rate<number>)}
            </AnimateNumber>{' '}
            %
          </LabelWithValue>
          <LabelWithValue
            label="Total Staked"
            tooltip="Total quantity of ANC-UST LP tokens staked"
          >
            <AnimateNumber format={formatUTokenDecimal2}>
              {lpStakingState?.total_bond_amount
                ? lpStakingState.total_bond_amount
                : (0 as u<Token<number>>)}
            </AnimateNumber>
          </LabelWithValue>
        </div>
      </div>
    </ButtonCard>
  );
};

export const AncUstLp = styled(AncUstLpBase)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .heading {
    margin: 10px 0;
    text-align: center;
  }

  .values {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .value {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin-top: 5px;
      }
    }
  }
`;
