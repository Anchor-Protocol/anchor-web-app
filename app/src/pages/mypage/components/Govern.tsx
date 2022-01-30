import { formatANC } from '@anchor-protocol/notation';
import { useGovMyPollsQuery } from '@anchor-protocol/app-provider';
import { demicrofy } from '@libs/formatter';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import { useAccount } from 'contexts/account';
import { EmptySection } from 'pages/mypage/components/EmptySection';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface GovernProps {
  className?: string;
}

function GovernBase({ className }: GovernProps) {
  const { connected } = useAccount();

  const { data: myPolls = [] } = useGovMyPollsQuery();

  if (!connected || myPolls.length === 0) {
    return <EmptySection to="/poll/create">Create Poll</EmptySection>;
  }

  return (
    <Section className={className}>
      <HorizontalScrollTable minWidth={700} startPadding={20} endPadding={0}>
        <colgroup>
          <col style={{ minWidth: 210 }} />
          <col style={{ minWidth: 100 }} />
          <col style={{ minWidth: 120 }} />
          <col style={{ minWidth: 100 }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              Title
              <br />
              Poll ID
            </th>
            <th>
              <IconSpan>
                Vote{' '}
                <InfoTooltip>
                  User’s vote history on proposals in progress
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>
              <IconSpan>
                Vote ANC{' '}
                <InfoTooltip>
                  Amount of staked ANC used as voting power
                </InfoTooltip>
              </IconSpan>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {myPolls.map(({ id, title, my }) => (
            <tr key={'mypoll-' + id}>
              <td>
                {title}
                <br />
                <span>{id}</span>
              </td>
              <td data-vote={my?.vote}>{my ? my.vote.toUpperCase() : '-'}</td>
              <td>{my ? formatANC(demicrofy(my.balance)) + ' ANC' : '-'}</td>
              <td>
                <BorderButton component={Link} to={`/poll/${id}`}>
                  Poll Detail
                </BorderButton>
              </td>
            </tr>
          ))}
        </tbody>
      </HorizontalScrollTable>
    </Section>
  );
}

export const StyledGovern = styled(GovernBase)`
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
      th:nth-child(4),
      td:nth-child(4) {
        text-align: center;
      }

      th:nth-child(3),
      td:nth-child(3) {
        text-align: right;
      }
    }

    td {
      span {
        font-size: 13px;
        color: ${({ theme }) => theme.dimTextColor};
      }
    }

    td[data-vote='yes'] {
      color: ${({ theme }) => theme.colors.positive};
    }

    td[data-vote='no'] {
      color: ${({ theme }) => theme.colors.negative};
    }

    a {
      font-size: 12px;
      width: 120px;
      height: 32px;

      &:first-child {
        margin-right: 8px;
      }
    }
  }
`;

export const Govern = fixHMR(StyledGovern);
