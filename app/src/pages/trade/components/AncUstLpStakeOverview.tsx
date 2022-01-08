import {
  useAnchorWebapp,
  useAncLpStakingStateQuery,
  useAncPriceQuery,
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-provider';
import { formatANCWithPostfixUnits, formatLP } from '@anchor-protocol/notation';
import { ANC, AncUstLP, u, UST } from '@anchor-protocol/types';
import { useAstroportDepositQuery } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { rulerLightColor, rulerShadowColor } from '@libs/styled-neumorphism';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface AncUstLpStakeOverviewProps {
  className?: string;
}

function AncUstLpStakeOverviewBase({ className }: AncUstLpStakeOverviewProps) {
  const { contractAddress } = useAnchorWebapp();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const { data: { lpStakingState } = {} } = useAncLpStakingStateQuery();

  const { data: { userLPBalance, userLPDeposit, userLPPendingToken } = {} } =
    useRewardsAncUstLpRewardsQuery();

  const { data: { deposit } = {} } = useAstroportDepositQuery<AncUstLP>(
    contractAddress.cw20.AncUstLP,
  );

  const ancUstLp = useMemo(() => {
    if (
      !ancPrice ||
      !lpStakingState ||
      !userLPPendingToken ||
      !userLPDeposit ||
      !userLPBalance
    ) {
      return undefined;
    }

    const totalUserLPHolding = big(userLPBalance.balance).plus(userLPDeposit);

    const withdrawableAssets = {
      anc: big(ancPrice.ANCPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as u<ANC<Big>>,
      ust: big(ancPrice.USTPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as u<UST<Big>>,
    };

    const staked = deposit;

    const stakable = userLPBalance.balance;

    const reward = userLPPendingToken.pending_on_proxy;

    return { withdrawableAssets, staked, stakable, reward };
  }, [
    ancPrice,
    deposit,
    lpStakingState,
    userLPBalance,
    userLPDeposit,
    userLPPendingToken,
  ]);

  return (
    <ul className={className}>
      <li>
        <TooltipLabel title="Stakeable ANC-UST LP tokens" placement="top">
          Stakeable
        </TooltipLabel>
        <p>
          {ancUstLp?.stakable ? formatLP(demicrofy(ancUstLp.stakable)) : 0} LP
        </p>
      </li>
      <li>
        <TooltipLabel
          title="Quantity of staked ANC-UST LP tokens from the ANC-UST LP staking pool"
          placement="top"
        >
          Staked
        </TooltipLabel>
        <p>{ancUstLp?.staked ? formatLP(demicrofy(ancUstLp.staked)) : 0} LP</p>
      </li>
      <li>
        <TooltipLabel
          title="Quantity of claimable rewards from ANC-UST LP staking pool"
          placement="top"
        >
          Reward
        </TooltipLabel>
        <p>
          {ancUstLp?.reward
            ? formatANCWithPostfixUnits(demicrofy(ancUstLp.reward))
            : 0}{' '}
          ANC
        </p>
      </li>
    </ul>
  );
}

export const AncUstLpStakeOverview = styled(AncUstLpStakeOverviewBase)`
  list-style: none;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 88px;

  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    span {
      width: 112px;
      margin-bottom: 10px;
    }

    p {
      color: ${({ theme }) => theme.textColor};

      font-size: 18px;
      font-weight: 500;
    }

    &:not(:last-child) {
      border-right: 1px solid
        ${({ theme }) =>
          rulerShadowColor({
            intensity: theme.intensity,
            color: theme.sectionBackgroundColor,
          })};
    }

    &:not(:first-child) {
      border-left: 1px solid
        ${({ theme }) =>
          rulerLightColor({
            intensity: theme.intensity,
            color: theme.sectionBackgroundColor,
          })};
    }
  }

  margin-bottom: 56px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 60px);

    li {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      span {
        margin-bottom: 0;
      }

      p {
        font-size: 15px;
      }

      &:not(:last-child) {
        border-right: 0;
        border-bottom: 1px solid
          ${({ theme }) =>
            rulerShadowColor({
              intensity: theme.intensity,
              color: theme.sectionBackgroundColor,
            })};
      }

      &:not(:first-child) {
        border-left: 0;
        border-top: 1px solid
          ${({ theme }) =>
            rulerLightColor({
              intensity: theme.intensity,
              color: theme.sectionBackgroundColor,
            })};
      }
    }
  }
`;
