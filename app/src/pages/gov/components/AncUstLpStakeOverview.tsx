import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatLP,
} from '@anchor-protocol/notation';
import { uANC, uUST } from '@anchor-protocol/types';
import { TooltipLabel } from '@terra-dev/neumorphism-ui/components/TooltipLabel';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@terra-dev/styled-neumorphism';
import big, { Big } from 'big.js';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { useClaimableAncUstLp } from 'pages/gov/queries/claimableAncUstLp';
import { useLPStakingState } from 'pages/gov/queries/lpStakingState';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface AncUstLpStakeOverviewProps {
  className?: string;
}

function AncUstLpStakeOverviewBase({ className }: AncUstLpStakeOverviewProps) {
  const {
    data: { ancPrice },
  } = useANCPrice();

  const {
    data: { lpStakingState },
  } = useLPStakingState();

  const {
    data: { userLPStakingInfo, userLPBalance },
  } = useClaimableAncUstLp();

  const ancUstLp = useMemo(() => {
    if (!ancPrice || !lpStakingState || !userLPStakingInfo || !userLPBalance) {
      return undefined;
    }

    const totalUserLPHolding = big(userLPBalance.balance).plus(
      userLPStakingInfo.bond_amount,
    );

    const withdrawableAssets = {
      anc: big(ancPrice.ANCPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as uANC<Big>,
      ust: big(ancPrice.USTPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as uUST<Big>,
    };

    const staked = userLPStakingInfo.bond_amount;

    const stakable = userLPBalance.balance;

    const reward = userLPStakingInfo.pending_reward;

    return { withdrawableAssets, staked, stakable, reward };
  }, [ancPrice, lpStakingState, userLPBalance, userLPStakingInfo]);

  return (
    <ul className={className}>
      <li>
        <TooltipLabel title="Stakable ANC-UST LP tokens" placement="top">
          Stakable
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
            color: theme.backgroundColor,
          })};
    }

    &:not(:first-child) {
      border-left: 1px solid
        ${({ theme }) =>
          rulerLightColor({
            intensity: theme.intensity,
            color: theme.backgroundColor,
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
              color: theme.backgroundColor,
            })};
      }

      &:not(:first-child) {
        border-left: 0;
        border-top: 1px solid
          ${({ theme }) =>
            rulerLightColor({
              intensity: theme.intensity,
              color: theme.backgroundColor,
            })};
      }
    }
  }
`;
