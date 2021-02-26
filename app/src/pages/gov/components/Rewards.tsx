import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatFluidDecimalPoints,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { MenuItem } from '@material-ui/core';
import { MoreMenu } from 'pages/gov/components/MoreMenu';
import { govPathname } from 'pages/gov/env';
import { rewardsAncUstLpReward } from 'pages/gov/logics/rewardsAncUstLpReward';
import { rewardsAncUstLpWithdrawableAnc } from 'pages/gov/logics/rewardsAncUstLpWithdrawableAnc';
import { rewardsAncUstLpWithdrawableUst } from 'pages/gov/logics/rewardsAncUstLpWithdrawableUst';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { useLPStakingState } from 'pages/gov/queries/lpStakingState';
import { useRewards } from 'pages/gov/queries/rewards';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsProps {
  className?: string;
}

export function RewardsBase({ className }: RewardsProps) {
  const {
    data: { ancPrice },
  } = useANCPrice();
  const {
    data: { userLPBalance, userLPStakingInfo },
  } = useRewards();

  const {
    data: { lpStakingState },
  } = useLPStakingState();

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

  return (
    <section className={className}>
      <header>
        <h2>Rewards</h2>
        <div />
        <ActionButton>Claim All Rewards</ActionButton>
      </header>

      <Section>
        <h3>
          <label>Total Reward</label> <s>12.238</s> ANC
          <label>Total Reward Value</label> <s>12.238</s> ANC
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
              <td>ANC Government</td>
              <td>
                <s>134.84%</s>
              </td>
              <td>
                <s>34.84ANC + 482 UST</s>
              </td>
              <td>
                <s>34.84</s>
              </td>
              <td>
                <s>120,36.000</s>
              </td>
              <td>
                <MoreMenu size="25px">
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/ANC Government/provide`}
                  >
                    Pool
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${govPathname}/pool/ANC Government/stake`}
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
                <s>34.84</s>
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
