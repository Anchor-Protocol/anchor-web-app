import { useLastSyncedHeightQuery } from '@anchor-protocol/app-provider';
import { Schedule } from '@material-ui/icons';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TimeEnd } from '@libs/use-time-end';
import { pollStatusLabels } from 'pages/gov/components/formatPollStatus';
import { PollStatusSpan } from 'pages/gov/components/PollStatusSpan';
import { extractPollDetail } from 'pages/gov/logics/extractPollDetail';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PollGraph } from './PollGraph';
import { PollList } from './types';

export interface GridProps extends PollList {
  className?: string;
}

function GridBase({
  className,
  isLast,
  polls,
  govANCBalance,
  govState,
  govConfig,
  onClick,
  onLoadMore,
}: GridProps) {
  const { data: lastSyncedHeight = 0 } = useLastSyncedHeightQuery();

  const pollDetails = useMemo(() => {
    return govANCBalance && govState && govConfig && lastSyncedHeight
      ? polls.map((poll) => {
          return extractPollDetail(
            poll,
            govANCBalance,
            govState,
            govConfig,
            lastSyncedHeight,
          );
        })
      : [];
  }, [govANCBalance, govConfig, govState, lastSyncedHeight, polls]);

  return (
    <div className={className}>
      <div className="grid">
        {pollDetails.map(({ poll, vote, type, baseline, endsIn }) => (
          <Section key={'grid' + poll.id} onClick={() => onClick(poll)}>
            <div className="poll-id">
              <span>ID: {poll.id}</span>
              <span>{type}</span>
            </div>

            <div className="poll-status">
              <PollStatusSpan status={poll.status} endsIn={endsIn}>
                {pollStatusLabels[poll.status]}
              </PollStatusSpan>
            </div>

            <h2>{poll.title}</h2>

            <PollGraph
              total={vote.total}
              yes={vote.yes}
              no={vote.no}
              baseline={baseline.value}
              baselineLabel={baseline.label}
            />

            <div className="poll-ends-in">
              <IconSpan>
                <b>Estimated end time</b>{' '}
                <time>
                  {endsIn.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {', '}
                  {endsIn.toLocaleTimeString('en-US')}
                </time>{' '}
                <Schedule /> <TimeEnd endTime={endsIn} />
              </IconSpan>
            </div>
          </Section>
        ))}
      </div>

      {!isLast && (
        <BorderButton className="more" onClick={onLoadMore}>
          More
        </BorderButton>
      )}
    </div>
  );
}

export const Grid = styled(GridBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  .NeuSection-root {
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.hoverBackgroundColor};
    }
  }

  .poll-id {
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    color: ${({ theme }) => theme.dimTextColor};
  }

  .poll-status {
    margin-top: 30px;

    font-size: 13px;
    font-weight: 700;
  }

  h2 {
    margin-top: 8px;

    font-size: 20px;
    font-weight: 500;

    width: 80%;
    height: 60px;
    overflow: hidden;

    margin-bottom: 25px;
  }

  .poll-ends-in {
    margin-top: 60px;

    font-size: 13px;
    color: ${({ theme }) => theme.dimTextColor};

    svg {
      margin: 0 5px 0 10px;
      transform: scale(1.4) translateY(0.07em);
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .grid {
    display: grid;

    grid-template-columns: repeat(2, 1fr);
    grid-gap: 40px;

    .NeuSection-root {
      margin: 0;
    }
  }

  .more {
    width: 100%;
    margin-top: 40px;
  }

  @media (max-width: 1200px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 500px) {
    time {
      display: none;
    }
  }
`;
