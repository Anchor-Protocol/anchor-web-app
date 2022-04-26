import { TokenIcon } from '@anchor-protocol/token-icons';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { useCollateralGaugeQuery } from 'queries/gov/useCollateralGaugeQuery';
import React from 'react';
import styled from 'styled-components';
import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';
import { useMyGaugeVotingQuery } from 'queries/gov/useMyGaugeVotingQuery';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { CancelVote } from './CancelVote';
import { useVotingPowerQuery } from 'queries';
import { Vote } from './Vote';
import { useAccount } from 'contexts/account';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import format from 'date-fns/format';

const formatDate = (date: Date): string =>
  `${date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })} ${date.toLocaleTimeString('en-US')} ${format(date, 'z')}`;

export const CollateralList = () => {
  const { data: { collateral } = { collateral: [] } } =
    useCollateralGaugeQuery();

  const { data: myGaugeVoting = {} } = useMyGaugeVotingQuery();
  const { data: votingPower } = useVotingPowerQuery();
  const { connected, availablePost } = useAccount();
  const isInteractive = connected && availablePost;

  return (
    <Container>
      <HorizontalScrollTable minWidth={850}>
        <colgroup>
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 250 }} />
        </colgroup>
        <thead>
          <tr>
            <th>COLLATERAL LIST</th>
            <th>
              <p>Total votes</p>
              <p>{VEANC_SYMBOL}</p>
            </th>
            <th>
              <p>Total votes</p>
              <p>{VEANC_SYMBOL}</p>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collateral.map(
            ({ symbol, icon, name, votes, share, tokenAddress }) => {
              const myVotes = myGaugeVoting[tokenAddress];

              const isLocked = myVotes?.lockPeriodEndsAt > Date.now();
              const isVoteEnabled = isInteractive && votingPower && !isLocked;
              const isCancelVoteEnabled = isInteractive && myVotes && !isLocked;

              return (
                <tr key={symbol}>
                  <td>
                    <i>
                      <TokenIcon symbol={symbol} path={icon} />
                    </i>
                    <div>
                      <div className="symbol">{symbol}</div>
                      <p className="name">{name}</p>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      {formatUTokenIntegerWithoutPostfixUnits(votes)}
                    </div>
                    <p className="description">{(share * 100).toFixed(2)}%</p>
                  </td>
                  <td>
                    <div className="value">
                      {myVotes
                        ? `${formatUTokenIntegerWithoutPostfixUnits(
                            myVotes.amount,
                          )}`
                        : '-'}
                      {isLocked && (
                        <p className="description">
                          <IconSpan>
                            locked{' '}
                            <InfoTooltip>
                              The vote is locked until
                              <br />
                              {formatDate(new Date(myVotes.lockPeriodEndsAt))}
                            </InfoTooltip>
                          </IconSpan>
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <Vote
                      tokenAddress={tokenAddress}
                      disabled={!isVoteEnabled}
                    />
                    <CancelVote
                      disabled={!isCancelVoteEnabled}
                      tokenAddress={tokenAddress}
                    />
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </HorizontalScrollTable>
    </Container>
  );
};

const Container = styled(Section)`
  table {
    thead {
      th {
        text-align: right;
        vertical-align: top;

        &:first-child {
          font-size: 12px;
          font-weight: 500;
          color: ${({ theme }) => theme.textColor};
          text-align: left;
        }
      }
    }

    tbody {
      td {
        text-align: right;

        .value,
        .symbol {
          font-size: 16px;
        }

        .description,
        .name {
          font-size: 12px;
          color: ${({ theme }) => theme.dimTextColor};
        }

        &:first-child {
          text-align: left;

          display: flex;

          align-items: center;

          i {
            width: 60px;
            height: 60px;

            margin-right: 15px;

            svg,
            img {
              display: block;
              width: 60px;
              height: 60px;
            }
          }

          .coin {
            font-weight: bold;

            grid-column: 2;
            grid-row: 1/2;
          }

          .name {
            grid-column: 2;
            grid-row: 2;
          }
        }

        &:last-child {
          button {
            height: 32px;
            font-size: 12px;
            font-weight: 500;

            padding: 0 24px;

            &:not(:last-child) {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
`;
