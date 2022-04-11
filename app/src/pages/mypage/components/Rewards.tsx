import {
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { demicrofy, formatRate } from '@libs/formatter';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { MenuItem } from '@material-ui/core';
import big from 'big.js';
import { screen } from 'env';
import { MoreMenu } from 'pages/gov/components/MoreMenu';
import { useRewards } from 'pages/mypage/logics/useRewards';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  ustBorrowPathname,
} from 'pages/trade/env';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AncUstLpRewards } from './AncUstLpRewards';

export interface RewardsProps {
  className?: string;
}

export function RewardsBase({ className }: RewardsProps) {
  const {
    ancUstLp,
    govRewards,
    lpRewards,
    govGorvernance,
    ustBorrow,
    borrowerDistributionAPYs,
  } = useRewards();

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <section className={className}>
      <Section>
        <HorizontalScrollTable
          minWidth={1300}
          startPadding={20}
          endPadding={20}
        >
          <colgroup>
            <col style={{ minWidth: 210 }} />
            <col style={{ minWidth: 100 }} />
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
              <th>Stakeable</th>
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
                    ≈{' '}
                    {govGorvernance?.stakedValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(govGorvernance.stakedValue),
                        )
                      : 0}{' '}
                    UST
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
                    ≈{' '}
                    {govGorvernance?.stakableValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(govGorvernance.stakableValue),
                        )
                      : 0}{' '}
                    UST
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
                <MoreMenu>
                  <MenuItem
                    component={Link}
                    to={`/${ancGovernancePathname}/stake`}
                  >
                    Stake
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${ancGovernancePathname}/unstake`}
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
                    ≈{' '}
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
                  </IconSpan>
                </p>
              </td>
              <td>
                {lpRewards && lpRewards.length > 0
                  ? formatRate(lpRewards[0].apr)
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
                    ≈{' '}
                    {ancUstLp?.stakedValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(ancUstLp.stakedValue),
                        )
                      : 0}{' '}
                    UST
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
                    ≈{' '}
                    {ancUstLp?.stakableValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(ancUstLp.stakableValue),
                        )
                      : 0}{' '}
                    UST
                  </IconSpan>
                </p>
              </td>
              <td>
                {ancUstLp && (
                  <AncUstLpRewards
                    rewards={ancUstLp.rewards}
                    rewardsAmountInUst={ancUstLp.rewardsAmountInUst}
                  />
                )}
              </td>
              <td>
                <MoreMenu>
                  <MenuItem
                    component={Link}
                    to={`/${ancUstLpPathname}/provide`}
                  >
                    Provide
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${ancUstLpPathname}/withdraw`}
                  >
                    Withdraw
                  </MenuItem>
                  <MenuItem component={Link} to={`/${ancUstLpPathname}/stake`}>
                    Stake
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={`/${ancUstLpPathname}/unstake`}
                  >
                    Unstake
                  </MenuItem>
                  <MenuItem component={Link} to={`/claim/${ancUstLpPathname}`}>
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
                    ≈{' '}
                    {ustBorrow?.rewardValue
                      ? formatUSTWithPostfixUnits(
                          demicrofy(ustBorrow.rewardValue),
                        )
                      : 0}{' '}
                    UST
                  </IconSpan>
                </p>
              </td>
              <td>
                <MoreMenu>
                  <MenuItem component={Link} to={`/claim/${ustBorrowPathname}`}>
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
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(4),
      td:nth-child(4),
      th:nth-child(5),
      td:nth-child(5) {
        text-align: right;
      }

      .warning {
        color: ${({ theme }) => theme.colors.negative};
      }

      th:nth-child(2),
      td:nth-child(2),
      th:nth-child(6),
      td:nth-child(6) {
        text-align: center;
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
