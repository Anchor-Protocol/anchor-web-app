import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatFluidDecimalPoints,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uANC } from '@anchor-protocol/types';
import { MenuItem } from '@material-ui/core';
import big, { Big } from 'big.js';
import { MoreMenu } from 'pages/gov/components/MoreMenu';
import { govPathname } from 'pages/gov/env';
import { rewardsAncGovernanceStakable } from 'pages/gov/logics/rewardsAncGovernanceStakable';
import { rewardsAncGovernanceWithdrawableAsset } from 'pages/gov/logics/rewardsAncGovernanceWithdrawableAsset';
import { rewardsAncUstLpReward } from 'pages/gov/logics/rewardsAncUstLpReward';
import { rewardsAncUstLpWithdrawableAnc } from 'pages/gov/logics/rewardsAncUstLpWithdrawableAnc';
import { rewardsAncUstLpWithdrawableUst } from 'pages/gov/logics/rewardsAncUstLpWithdrawableUst';
import { rewardsTotalBorrowReward } from 'pages/gov/logics/rewardsTotalBorrowReward';
import { rewardsTotalReward } from 'pages/gov/logics/rewardsTotalReward';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { useLPStakingState } from 'pages/gov/queries/lpStakingState';
import { useRewardsAncGovernance } from 'pages/gov/queries/rewardsAncGovernance';
import { useRewardsAncUstLp } from 'pages/gov/queries/rewardsAncUstLp';
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
    data: { userLPBalance, userLPStakingInfo },
  } = useRewardsAncUstLp();

  const {
    data: { userGovStakingInfo, userANCBalance },
  } = useRewardsAncGovernance();

  const {
    data: { borrowerInfo, marketState },
  } = useRewardsUSTBorrow();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const ancUstLpWithdrawableAnc = useMemo(
    () =>
      rewardsAncUstLpWithdrawableAnc(
        ancPrice?.ANCPoolSize,
        userLPBalance?.balance,
        ancPrice?.LPShare,
      ),
    [ancPrice?.ANCPoolSize, ancPrice?.LPShare, userLPBalance?.balance],
  );

  const ancUstLpWithdrawableUst = useMemo(
    () =>
      rewardsAncUstLpWithdrawableUst(
        ancPrice?.USTPoolSize,
        userLPBalance?.balance,
        ancPrice?.LPShare,
      ),
    [ancPrice?.LPShare, ancPrice?.USTPoolSize, userLPBalance?.balance],
  );

  const ancUstLpReward = useMemo(() => {
    return rewardsAncUstLpReward(
      lpStakingState?.global_reward_index,
      userLPStakingInfo?.reward_index,
      userLPStakingInfo?.bond_amount,
      userLPStakingInfo?.pending_reward,
    );
  }, [
    lpStakingState?.global_reward_index,
    userLPStakingInfo?.bond_amount,
    userLPStakingInfo?.pending_reward,
    userLPStakingInfo?.reward_index,
  ]);

  const ancGovernanceWithdrawableAsset = useMemo(() => {
    return rewardsAncGovernanceWithdrawableAsset(
      govANCBalance?.balance,
      govState?.total_deposit,
      govState?.total_share,
      userGovStakingInfo?.share,
    );
  }, [
    govANCBalance?.balance,
    govState?.total_deposit,
    govState?.total_share,
    userGovStakingInfo?.share,
  ]);

  const ancGovernanceStakable = useMemo(() => {
    return rewardsAncGovernanceStakable(userANCBalance?.balance);
  }, [userANCBalance?.balance]);

  const ustBorrowReward = useMemo(() => {
    return rewardsTotalBorrowReward(
      marketState?.global_interest_index,
      borrowerInfo?.reward_index,
      borrowerInfo?.pending_rewards,
    );
  }, [
    borrowerInfo?.pending_rewards,
    borrowerInfo?.reward_index,
    marketState?.global_interest_index,
  ]);

  const totalReward = useMemo(() => {
    return rewardsTotalReward(ustBorrowReward, ancUstLpReward);
  }, [ancUstLpReward, ustBorrowReward]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <section className={className}>
      <header>
        <h2>Rewards</h2>
        <div />
        <ActionButton>Claim All Rewards</ActionButton>
      </header>

      <Section>
        <h3>
          <label>Total Reward</label>{' '}
          {totalReward ? formatUSTWithPostfixUnits(demicrofy(totalReward)) : 0}{' '}
          UST
          <label>Total Reward Value</label>{' '}
          {totalReward && ancPrice?.ANCPrice
            ? formatANCWithPostfixUnits(
                demicrofy(big(totalReward).mul(ancPrice.ANCPrice) as uANC<Big>),
              )
            : 0}{' '}
          ANC
        </h3>

        <HorizontalScrollTable
          minWidth={1000}
          startPadding={20}
          endPadding={20}
        >
          <colgroup>
            <col style={{ minWidth: 210 }} />
            <col style={{ minWidth: 205 }} />
            <col style={{ minWidth: 340 }} />
            <col style={{ minWidth: 200 }} />
            <col style={{ minWidth: 160 }} />
            <col style={{ minWidth: 100 }} />
          </colgroup>
          <thead>
            <tr>
              <th>Rewards Pool</th>
              <th>APY</th>
              <th>Withdrawable Asset</th>
              <th>Reward</th>
              <th>Stakable</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ANC-UST LP</td>
              <td>
                <s>134.84%</s>
              </td>
              <td>
                {ancUstLpWithdrawableAnc
                  ? formatANCWithPostfixUnits(
                      demicrofy(ancUstLpWithdrawableAnc),
                    )
                  : 0}{' '}
                ANC +{' '}
                {ancUstLpWithdrawableUst
                  ? formatUSTWithPostfixUnits(
                      demicrofy(ancUstLpWithdrawableUst),
                    )
                  : 0}{' '}
                UST
              </td>
              <td>
                {ancUstLpReward
                  ? formatFluidDecimalPoints(ancUstLpReward, 2)
                  : 0}
              </td>
              <td>
                <s>0</s>
              </td>
              <td>
                <MoreMenu size="25px">
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/ANC-UST LP/provide`}
                  >
                    Pool
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/ANC-UST LP/stake`}
                  >
                    Stake
                  </MenuItem>
                  <MenuItem>Claim</MenuItem>
                </MoreMenu>
              </td>
            </tr>
            <tr>
              <td>ANC Governance</td>
              <td>
                <s>134.84%</s>
              </td>
              <td>
                {ancGovernanceWithdrawableAsset
                  ? formatANCWithPostfixUnits(
                      demicrofy(ancGovernanceWithdrawableAsset),
                    )
                  : 0}{' '}
                ANC
              </td>
              <td></td>
              <td>
                {ancGovernanceStakable
                  ? formatANCWithPostfixUnits(demicrofy(ancGovernanceStakable))
                  : 0}
              </td>
              <td>
                <MoreMenu size="25px">
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/ANC Governance/provide`}
                  >
                    Pool
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/ANC Governance/stake`}
                  >
                    Stake
                  </MenuItem>
                  <MenuItem>Claim</MenuItem>
                </MoreMenu>
              </td>
            </tr>
            <tr>
              <td>UST Borrow</td>
              <td>
                <s>134.84%</s>
              </td>
              <td></td>
              <td>
                {ustBorrowReward
                  ? formatUSTWithPostfixUnits(demicrofy(ustBorrowReward))
                  : 0}
              </td>
              <td>
                <s>0</s>
              </td>
              <td>
                <MoreMenu size="25px">
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/UST Borrow/provide`}
                  >
                    Pool
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/UST Borrow/stake`}
                  >
                    Stake
                  </MenuItem>
                  <MenuItem>Claim</MenuItem>
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
      td:nth-child(4) {
        text-align: center;
      }

      th:nth-child(5) {
        text-align: right;
      }

      td:nth-child(5) {
        color: #e95979;
        text-align: right;
      }

      th:nth-child(6),
      td:nth-child(6) {
        text-align: right;
      }
    }
  }
`;
