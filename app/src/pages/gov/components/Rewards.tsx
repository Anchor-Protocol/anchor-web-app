import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { MenuItem } from '@material-ui/core';
import { MoreMenu } from 'pages/gov/components/MoreMenu';
import { govPathname } from 'pages/gov/env';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsProps {
  className?: string;
}

export function RewardsBase({ className }: RewardsProps) {
  return (
    <section className={className}>
      <header>
        <h2>Rewards</h2>
        <div />
        <ActionButton>Claim All Rewards</ActionButton>
      </header>

      <Section>
        <h3>
          <label>Total Reward</label> 12.238 ANC
          <label>Total Reward Value</label> 12.238 ANC
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
              <td>134.84%</td>
              <td>34.84ANC + 482 UST</td>
              <td>34.84</td>
              <td>0</td>
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
              <td>134.84%</td>
              <td>34.84ANC + 482 UST</td>
              <td>34.84</td>
              <td>120,36.000</td>
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
              <td>134.84%</td>
              <td></td>
              <td>34.84</td>
              <td>0</td>
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
