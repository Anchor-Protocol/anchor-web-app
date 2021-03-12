import { Label } from '@anchor-protocol/neumorphism-ui/components/Label';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatLP,
} from '@anchor-protocol/notation';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { uANC, uUST } from '@anchor-protocol/types';
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
        <Tooltip title="Stakable ANC-UST LP tokens" placement="top">
          <Label>Stakable</Label>
        </Tooltip>
        <p>
          {ancUstLp?.stakable ? formatLP(demicrofy(ancUstLp.stakable)) : 0} LP
        </p>
      </li>
      <li>
        <Tooltip
          title="Quantity of staked ANC-UST LP tokens from the ANC-UST LP staking pool"
          placement="top"
        >
          <Label>Staked</Label>
        </Tooltip>
        <p>{ancUstLp?.staked ? formatLP(demicrofy(ancUstLp.staked)) : 0} LP</p>
      </li>
      <li>
        <Tooltip
          title="Quantity of claimable rewards from ANC-UST LP staking pool"
          placement="top"
        >
          <Label>Reward</Label>
        </Tooltip>
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
`;
