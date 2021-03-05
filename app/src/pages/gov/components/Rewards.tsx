import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import { MenuItem } from '@material-ui/core';
import big, { Big } from 'big.js';
import { MoreMenu } from 'pages/gov/components/MoreMenu';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  govPathname,
  ustBorrowPathname,
} from 'pages/gov/env';
import { rewardsAncGovernanceStakable } from 'pages/gov/logics/rewardsAncGovernanceStakable';
import { rewardsAncGovernanceStaked } from 'pages/gov/logics/rewardsAncGovernanceStaked';
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
    () => rewardsAncUstLpWithdrawableAnc(ancPrice, userLPBalance),
    [ancPrice, userLPBalance],
  );

  const ancUstLpWithdrawableUst = useMemo(
    () => rewardsAncUstLpWithdrawableUst(ancPrice, userLPBalance),
    [ancPrice, userLPBalance],
  );

  const ancUstLpStaked = useMemo(() => {
    return userLPStakingInfo?.bond_amount;
  }, [userLPStakingInfo?.bond_amount]);

  const ancUstLpReward = useMemo(() => {
    return rewardsAncUstLpReward(lpStakingState, userLPStakingInfo);
  }, [lpStakingState, userLPStakingInfo]);

  const ancGovernanceStaked = useMemo(() => {
    return rewardsAncGovernanceStaked(
      govANCBalance,
      govState,
      userGovStakingInfo,
    );
  }, [govANCBalance, govState, userGovStakingInfo]);

  const ancGovernanceStakable = useMemo(() => {
    return rewardsAncGovernanceStakable(userANCBalance);
  }, [userANCBalance]);

  const ustBorrowReward = useMemo(() => {
    return rewardsTotalBorrowReward(marketState, borrowerInfo);
  }, [borrowerInfo, marketState]);

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
        <ActionButton component={Link} to={`/${govPathname}/claim/all`}>
          Claim All Rewards
        </ActionButton>
      </header>

      <Section>
        <h3>
          <label>Total Reward</label>{' '}
          {totalReward ? formatANCWithPostfixUnits(demicrofy(totalReward)) : 0}{' '}
          ANC
          <label>Total Reward Value</label>{' '}
          {totalReward && ancPrice?.ANCPrice
            ? formatUSTWithPostfixUnits(
                demicrofy(big(totalReward).mul(ancPrice.ANCPrice) as uUST<Big>),
              )
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
              <th>APY</th>
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
                </p>
              </td>
              <td>
                <s>134.84%</s>
              </td>
              <td>
                {ancUstLpStaked ? formatLP(demicrofy(ancUstLpStaked)) : 0}
              </td>
              <td>
                <s>0</s>
              </td>
              <td>
                {ancUstLpReward
                  ? formatANCWithPostfixUnits(demicrofy(ancUstLpReward))
                  : 0}
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
                {ancGovernanceStaked
                  ? formatANCWithPostfixUnits(demicrofy(ancGovernanceStaked))
                  : 0}{' '}
                ANC
              </td>
              <td>
                {ancGovernanceStakable
                  ? formatANCWithPostfixUnits(demicrofy(ancGovernanceStakable))
                  : 0}
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
              <td>
                <s>0</s>
              </td>
              <td>
                {ustBorrowReward
                  ? formatUSTWithPostfixUnits(demicrofy(ustBorrowReward))
                  : 0}
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

      //th:nth-child(5) {
      //  text-align: right;
      //}

      //td:nth-child(5) {
      //  color: #e95979;
      //  text-align: right;
      //}

      th:nth-child(6),
      td:nth-child(6) {
        text-align: right;
      }
    }
  }
`;
