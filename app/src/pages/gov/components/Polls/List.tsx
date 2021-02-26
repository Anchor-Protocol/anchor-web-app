import { BorderButton } from '@anchor-protocol/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TimeEnd } from '@anchor-protocol/use-time-end';
import styled from 'styled-components';
import { PollTinyGraph } from './PollTinyGraph';
import { PollList } from './types';

export interface ListProps extends PollList {
  className?: string;
}

function ListBase({ className, polls, onClick, onLoadMore }: ListProps) {
  return (
    <Section className={className}>
      <HorizontalScrollTable minWidth={1200} startPadding={20} endPadding={20}>
        <colgroup>
          <col style={{ width: 70 }} />
          <col style={{ width: 150 }} />
          <col style={{ width: 150 }} />
          <col style={{ width: 400 }} />
          <col style={{ width: 260 }} />
          <col style={{ width: 150 }} />
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Title</th>
            <th>Voted</th>
            <th>Ends In</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={'list' + poll.id} onClick={() => onClick(poll)}>
              <td>{poll.id}</td>
              <td>
                <s>Gov Update</s>
              </td>
              <td>{poll.status}</td>
              <td>{poll.title}</td>
              <td>
                <PollTinyGraph
                  total={+poll.yes_votes + +poll.no_votes}
                  yes={+poll.yes_votes}
                  no={+poll.no_votes}
                  baseline={Math.floor(
                    (+poll.yes_votes + +poll.no_votes) * 0.45,
                  )}
                />
              </td>
              <td>
                <s>
                  <TimeEnd endTime={new Date(Date.now() * 1000000)} />
                </s>
              </td>
            </tr>
          ))}
        </tbody>
      </HorizontalScrollTable>

      <BorderButton className="more" onClick={onLoadMore}>
        More
      </BorderButton>
    </Section>
  );
}

export const List = styled(ListBase)`
  table {
    min-width: 1000px;

    thead,
    tbody {
      td:nth-child(4) {
        white-space: break-spaces;
      }

      td:nth-child(5) {
        > div {
          min-width: 240px;
          max-width: 240px;

          transform: translateY(12px);
        }
      }

      th:nth-child(6),
      td:nth-child(6) {
        text-align: right;
      }
    }

    tbody {
      tr {
        cursor: pointer;

        &:hover {
          background-color: ${({ theme }) => theme.hoverBackgroundColor};
        }
      }
    }
  }

  .more {
    width: 100%;
    margin-top: 20px;
  }
`;
