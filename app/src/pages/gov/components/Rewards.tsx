import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatLP,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uANC, uUST } from '@anchor-protocol/types';
import {
  useAncLpStakingStateQuery,
  useAncPriceQuery,
  useBorrowAPYQuery,
  useRewardsAncGovernanceRewardsQuery,
  useRewardsClaimableAncUstLpRewardsQuery,
  useRewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { MenuItem } from '@material-ui/core';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@terra-dev/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import big, { Big } from 'big.js';
import { screen } from 'env';
import { MoreMenu } from 'pages/gov/components/MoreMenu';
import { SubHeader } from 'pages/gov/components/SubHeader';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  govPathname,
  ustBorrowPathname,
} from 'pages/gov/env';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsProps {
  className?: string;
}

export function RewardsBase({ className }: RewardsProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: { ancPrice } = {} } = useAncPriceQuery();
  //const {
  //  data: { ancPrice },
  //} = useANCPrice();

  const { data: { lpStakingState } = {} } = useAncLpStakingStateQuery();
  //const {
  //  data: { lpStakingState },
  //} = useLPStakingState();

  const {
    data: { lPBalance: userLPBalance, lPStakerInfo: userLPStakingInfo } = {},
  } = useRewardsClaimableAncUstLpRewardsQuery();
  //const {
  //  data: { userLPStakingInfo, userLPBalance },
  //} = useClaimableAncUstLp();

  const {
    data: { userANCBalance, userGovStakingInfo } = {},
  } = useRewardsAncGovernanceRewardsQuery();
  //const {
  //  data: { userGovStakingInfo, userANCBalance },
  //} = useRewardsAncGovernance();

  const {
    data: { borrowerInfo, marketState } = {},
  } = useRewardsClaimableUstBorrowRewardsQuery();
  //const {
  //  data: { borrowerInfo, marketState },
  //} = useClaimableUstBorrow();

  const {
    data: { govRewards, lpRewards, borrowerDistributionAPYs } = {},
  } = useBorrowAPYQuery();

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

    const LPValue = big(ancPrice.USTPoolSize)
      .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare)
      .mul(2) as uUST<Big>;

    const withdrawableAssets = {
      anc: big(ancPrice.ANCPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as uANC<Big>,
      ust: big(ancPrice.USTPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as uUST<Big>,
    };

    const staked = userLPStakingInfo.bond_amount;
    const stakedValue = big(staked).mul(LPValue) as uUST<Big>;

    const stakable = userLPBalance.balance;
    const stakableValue = big(stakable).mul(LPValue) as uUST<Big>;

    const reward = userLPStakingInfo.pending_reward;
    const rewardValue = big(reward).mul(ancPrice.ANCPrice) as uUST<Big>;

    return {
      withdrawableAssets,
      LPValue,
      staked,
      stakedValue,
      stakable,
      stakableValue,
      reward,
      rewardValue,
    };
  }, [ancPrice, lpStakingState, userLPBalance, userLPStakingInfo]);

  const govGorvernance = useMemo(() => {
    if (!userGovStakingInfo || !userANCBalance || !ancPrice) {
      return undefined;
    }

    const staked = big(userGovStakingInfo.balance) as uANC<Big>;
    console.log('Rewards.tsx..()', ancPrice.ANCPrice);
    const stakedValue = staked.mul(ancPrice.ANCPrice) as uUST<Big>;

    const stakable = big(userANCBalance.balance) as uANC<Big>;
    const stakableValue = stakable.mul(ancPrice.ANCPrice) as uUST<Big>;

    return { staked, stakedValue, stakable, stakableValue };
  }, [userANCBalance, userGovStakingInfo, ancPrice]);

  const ustBorrow = useMemo(() => {
    if (!marketState || !borrowerInfo || !ancPrice) {
      return undefined;
    }

    const reward = big(borrowerInfo.pending_rewards) as uANC<Big>;
    const rewardValue = reward.mul(ancPrice.ANCPrice) as uUST<Big>;

    return { reward, rewardValue };
  }, [borrowerInfo, marketState, ancPrice]);

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
      <SubHeader>
        <div>
          <h2>Rewards</h2>
        </div>
        <div>
          <ActionButton component={Link} to={`/${govPathname}/claim/all`}>
            Claim All Rewards
          </ActionButton>
        </div>
      </SubHeader>

      <Section>
        <h3>
          <div>
            <label>Total Reward</label>{' '}
            {total?.reward
              ? formatANCWithPostfixUnits(demicrofy(total.reward))
              : 0}{' '}
            ANC
          </div>
          <div>
            <label>Total Reward Value</label>{' '}
            {total?.rewardValue
              ? formatUSTWithPostfixUnits(demicrofy(total.rewardValue))
              : 0}{' '}
            UST
          </div>
        </h3>

        <HorizontalScrollTable
          minWidth={1200}
          startPadding={20}
          endPadding={20}
        >
          <colgroup>
            <col style={{ minWidth: 210 }} />
            <col style={{ minWidth: 180 }} />
            <col style={{ minWidth: 240 }} />
            <col style={{ minWidth: 240 }} />
            <col style={{ minWidth: 200 }} />
            <col style={{ minWidth: 100 }} />
          </colgroup>
          <thead>
            <tr>
              <th>Rewards Pool</th>
              <th>
                <IconSpan>
                  APR <InfoTooltip>Annualized Staking Returns</InfoTooltip>
                </IconSpan>
              </th>
              <th>
                <IconSpan>
                  Staked{' '}
                  <InfoTooltip>
                    Quantity of staked assets from the corresponding reward
                    pools
                  </InfoTooltip>
                </IconSpan>
              </th>
              <th>Stakable</th>
              <th>
                <IconSpan>
                  Reward{' '}
                  <InfoTooltip>
                    Quantity of claimable rewards for the corresponding staking
                    pool
                  </InfoTooltip>
                </IconSpan>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ANC Governance</td>
              <td>
                {govRewards && govRewards.length > 0
                  ? formatRate(govRewards[0].CurrentAPY)
                  : 0}{' '}
                %
              </td>
              <td>
                <p>
                  {govGorvernance?.staked
                    ? formatANCWithPostfixUnits(
                        demicrofy(govGorvernance.staked),
                      )
                    : 0}{' '}
                  ANC
                </p>
                <p className="subtext">
                  <IconSpan>
                    {govGorvernance?.stakedValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(govGorvernance.stakedValue),
                        )
                      : 0}{' '}
                    UST <InfoTooltip>Staked ANC value in UST</InfoTooltip>
                  </IconSpan>
                </p>
              </td>
              <td>
                <p>
                  {govGorvernance?.stakable
                    ? formatANCWithPostfixUnits(
                        demicrofy(govGorvernance.stakable),
                      )
                    : 0}{' '}
                  ANC
                </p>
                <p className="subtext">
                  <IconSpan>
                    {govGorvernance?.stakableValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(govGorvernance.stakableValue),
                        )
                      : 0}{' '}
                    UST <InfoTooltip>Stakeable ANC value in UST</InfoTooltip>
                  </IconSpan>
                </p>
              </td>
              <td>
                <IconSpan>
                  Automatically re-staked{' '}
                  <InfoTooltip>
                    A portion of excess interest and bAsset staking rewards are
                    automatically distributed to ANC stakers
                  </InfoTooltip>
                </IconSpan>
              </td>
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
              <td>
                <p>ANC-UST LP</p>
                <p className="subtext">
                  <IconSpan>
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
                    UST{' '}
                    <InfoTooltip>
                      Amount of withdrawable assets from the ANC-UST pair
                    </InfoTooltip>
                  </IconSpan>
                </p>
              </td>
              <td>
                {lpRewards && lpRewards.length > 0
                  ? formatRate(lpRewards[0].APY)
                  : 0}{' '}
                %
              </td>
              <td>
                <p>
                  {ancUstLp?.staked ? formatLP(demicrofy(ancUstLp.staked)) : 0}{' '}
                  LP
                </p>
                <p className="subtext">
                  <IconSpan>
                    {ancUstLp?.stakedValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(ancUstLp.stakedValue),
                        )
                      : 0}{' '}
                    UST <InfoTooltip>Staked LP value in UST</InfoTooltip>
                  </IconSpan>
                </p>
              </td>
              <td
                className={
                  big(ancUstLp?.stakable ?? 0).gt(0) ? 'warning' : undefined
                }
              >
                <p>
                  {ancUstLp?.stakable
                    ? formatLP(demicrofy(ancUstLp.stakable))
                    : 0}{' '}
                  LP
                </p>
                <p className="subtext">
                  <IconSpan>
                    {ancUstLp?.stakableValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(ancUstLp.stakableValue),
                        )
                      : 0}{' '}
                    UST <InfoTooltip>Stakeable LP value in UST</InfoTooltip>
                  </IconSpan>
                </p>
              </td>
              <td>
                <p>
                  {ancUstLp?.reward
                    ? formatANCWithPostfixUnits(demicrofy(ancUstLp.reward))
                    : 0}{' '}
                  ANC
                </p>
                <p className="subtext">
                  <IconSpan>
                    {ancUstLp?.rewardValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(ancUstLp.rewardValue),
                        )
                      : 0}{' '}
                    UST <InfoTooltip>Reward ANC value in UST</InfoTooltip>
                  </IconSpan>
                </p>
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
              <td>UST Borrow</td>
              <td>
                {borrowerDistributionAPYs && borrowerDistributionAPYs.length > 0
                  ? formatRate(borrowerDistributionAPYs[0].DistributionAPY)
                  : 0}{' '}
                %
              </td>
              <td></td>
              <td></td>
              <td>
                <p>
                  {ustBorrow?.reward
                    ? formatANCWithPostfixUnits(demicrofy(ustBorrow.reward))
                    : 0}{' '}
                  ANC
                </p>
                <p className="subtext">
                  <IconSpan>
                    {ustBorrow?.rewardValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(ustBorrow.rewardValue),
                        )
                      : 0}{' '}
                    UST <InfoTooltip>Reward ANC value in UST</InfoTooltip>
                  </IconSpan>
                </p>
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
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  h3 {
    display: flex;

    > div:nth-of-type(2) {
      margin-left: 40px;
    }

    font-size: 14px;
    color: ${({ theme }) => theme.textColor};
    font-weight: 700;

    margin-bottom: 60px;

    label {
      color: ${({ theme }) => theme.dimTextColor};
      font-weight: 500;

      margin-right: 10px;
    }
  }

  table {
    min-width: 1000px;

    tbody {
      td {
        font-size: 16px;
        letter-spacing: -0.3px;

        .subtext {
          font-size: 12px;
          color: ${({ theme }) => theme.dimTextColor};
        }
      }
    }

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

      .warning {
        color: ${({ theme }) => theme.colors.negative};
      }

      th:nth-child(6),
      td:nth-child(6) {
        text-align: right;
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  // under tablet
  @media (max-width: ${screen.tablet.max}px) {
    h3 {
      display: flex;
      flex-direction: column;

      > div {
        label {
          display: inline-block;
          width: 150px;
        }
      }

      > div:nth-of-type(2) {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  }
`;
