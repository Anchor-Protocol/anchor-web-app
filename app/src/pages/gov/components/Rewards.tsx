import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uANC, uUST } from '@anchor-protocol/types';
import { MenuItem } from '@material-ui/core';
import big, { Big } from 'big.js';
import { MoreMenu } from 'pages/gov/components/MoreMenu';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  govPathname,
  ustBorrowPathname,
} from 'pages/gov/env';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { useClaimableAncUstLp } from 'pages/gov/queries/claimableAncUstLp';
import { useLPStakingState } from 'pages/gov/queries/lpStakingState';
import { useRewardsAncGovernance } from 'pages/gov/queries/rewardsAncGovernance';
import { useRewardsUSTBorrow } from 'pages/gov/queries/rewardsUSTBorrow';
import { useTotalStaked } from 'pages/gov/queries/totalStaked';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsProps {
  className?: string;
}

export function RewardsBase({ className }: RewardsProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    data: { ancPrice },
  } = useANCPrice();

  const {
    data: { govANCBalance, govState },
  } = useTotalStaked();

  const {
    data: { lpStakingState },
  } = useLPStakingState();

  const {
    data: { userLPStakingInfo, userLPBalance },
  } = useClaimableAncUstLp();

  const {
    data: { userGovStakingInfo, userANCBalance },
  } = useRewardsAncGovernance();

  const {
    data: { borrowerInfo, marketState },
  } = useRewardsUSTBorrow();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
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

  const govGorvernance = useMemo(() => {
    if (!govANCBalance || !govState || !userGovStakingInfo || !userANCBalance) {
      return undefined;
    }

    const govShareIndex = big(
      big(govANCBalance.balance).minus(govState.total_deposit),
    ).div(govState.total_share);

    const staked = big(userGovStakingInfo.share).mul(
      govShareIndex,
    ) as uANC<Big>;

    const stakable = userANCBalance.balance;

    return { staked, stakable };
  }, [govANCBalance, govState, userANCBalance, userGovStakingInfo]);

  const ustBorrow = useMemo(() => {
    if (!marketState || !borrowerInfo) {
      return undefined;
    }

    const reward = big(marketState.global_reward_index)
      .minus(borrowerInfo.reward_index)
      .plus(borrowerInfo.pending_rewards) as uANC<Big>;

    return { reward };
  }, [borrowerInfo, marketState]);

  const total = useMemo(() => {
    if (!ustBorrow || !ancUstLp || !ancPrice) {
      return undefined;
    }

    const reward = ustBorrow.reward.plus(ancUstLp.reward) as uANC<Big>;
    const rewardValue = reward.mul(ancPrice.ANCPrice) as uUST<Big>;

    return { reward, rewardValue };
  }, [ancPrice, ancUstLp, ustBorrow]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <section className={className}>
      <header>
        <h2>Rewards</h2>
        <div />
        <ActionButton component={Link} to={`/${govPathname}/claim/all`}>
          Claim All Rewards
        </ActionButton>
      </header>

      <Section>
        <h3>
          <label>Total Reward</label>{' '}
          {total?.reward
            ? formatANCWithPostfixUnits(demicrofy(total.reward))
            : 0}{' '}
          ANC
          <label>Total Reward Value</label>{' '}
          {total?.rewardValue
            ? formatUSTWithPostfixUnits(demicrofy(total.rewardValue))
            : 0}{' '}
          UST
        </h3>

        <HorizontalScrollTable
          minWidth={1200}
          startPadding={20}
          endPadding={20}
        >
          <colgroup>
            <col style={{ minWidth: 210 }} />
            <col style={{ minWidth: 205 }} />
            <col style={{ minWidth: 340 }} />
            <col style={{ minWidth: 160 }} />
            <col style={{ minWidth: 200 }} />
            <col style={{ minWidth: 100 }} />
          </colgroup>
          <thead>
            <tr>
              <th>Rewards Pool</th>
              <th>
                <IconSpan>
                  APY <InfoTooltip>Annualized Staking Returns</InfoTooltip>
                </IconSpan>
              </th>
              <th>Staked</th>
              <th>Stakable</th>
              <th>Reward</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>ANC-UST LP</p>
                <p style={{ fontSize: 12 }}>
                  {ancUstLp?.withdrawableAssets
                    ? formatANCWithPostfixUnits(
                        demicrofy(ancUstLp.withdrawableAssets.anc),
                      )
                    : 0}{' '}
                  ANC +{' '}
                  {ancUstLp?.withdrawableAssets
                    ? formatUSTWithPostfixUnits(
                        demicrofy(ancUstLp.withdrawableAssets.ust),
                      )
                    : 0}{' '}
                  UST
                </p>
              </td>
              <td>
                <s>134.84%</s>
              </td>
              <td>
                {ancUstLp?.staked ? formatLP(demicrofy(ancUstLp.staked)) : 0} LP
              </td>
              <td>
                {ancUstLp?.stakable
                  ? formatLP(demicrofy(ancUstLp.stakable))
                  : 0}{' '}
                LP
              </td>
              <td>
                {ancUstLp?.reward
                  ? formatANCWithPostfixUnits(demicrofy(ancUstLp.reward))
                  : 0}{' '}
                ANC
              </td>
              <td>
                <MoreMenu size="25px">
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/rewards/${ancUstLpPathname}/provide`}
                  >
                    Provide
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/rewards/${ancUstLpPathname}/withdraw`}
                  >
                    Withdraw
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/rewards/${ancUstLpPathname}/stake`}
                  >
                    Stake
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/rewards/${ancUstLpPathname}/unstake`}
                  >
                    Unstake
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/claim/${ancUstLpPathname}`}
                  >
                    Claim
                  </MenuItem>
                </MoreMenu>
              </td>
            </tr>
            <tr>
              <td>ANC Governance</td>
              <td>
                <s>134.84%</s>
              </td>
              <td>
                {govGorvernance?.staked
                  ? formatANCWithPostfixUnits(demicrofy(govGorvernance.staked))
                  : 0}{' '}
                ANC
              </td>
              <td>
                {govGorvernance?.stakable
                  ? formatANCWithPostfixUnits(
                      demicrofy(govGorvernance.stakable),
                    )
                  : 0}{' '}
                ANC
              </td>
              <td>Automatically re-staked</td>
              <td>
                <MoreMenu size="25px">
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/rewards/${ancGovernancePathname}/stake`}
                  >
                    Stake
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/rewards/${ancGovernancePathname}/unstake`}
                  >
                    Unstake
                  </MenuItem>
                </MoreMenu>
              </td>
            </tr>
            <tr>
              <td>UST Borrow</td>
              <td>
                <s>134.84%</s>
              </td>
              <td></td>
              <td></td>
              <td>
                {ustBorrow?.reward
                  ? formatUSTWithPostfixUnits(demicrofy(ustBorrow.reward))
                  : 0}{' '}
                ANC
              </td>
              <td>
                <MoreMenu size="25px">
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/claim/${ustBorrowPathname}`}
                  >
                    Claim
                  </MenuItem>
                </MoreMenu>
              </td>
            </tr>
          </tbody>
        </HorizontalScrollTable>
      </Section>
    </section>
  );
}

export const Rewards = styled(RewardsBase)`
  h3 {
    font-size: 14px;
    color: ${({ theme }) => theme.textColor};
    font-weight: 700;

    margin-bottom: 60px;

    label {
      color: ${({ theme }) => theme.dimTextColor};
      font-weight: 500;

      margin-right: 10px;

      &:nth-of-type(2) {
        margin-left: 40px;
      }
    }
  }

  table {
    min-width: 1000px;

    thead,
    tbody {
      th:nth-child(2),
      td:nth-child(2),
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(4),
      td:nth-child(4),
      th:nth-child(5),
      td:nth-child(5) {
        text-align: center;
      }

      td:nth-child(4) {
        color: ${({ theme }) => theme.colors.negative};
      }

      th:nth-child(6),
      td:nth-child(6) {
        text-align: right;
      }
    }
  }
`;
