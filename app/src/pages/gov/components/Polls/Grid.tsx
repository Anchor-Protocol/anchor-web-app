import { BorderButton } from '@anchor-protocol/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TimeEnd } from '@anchor-protocol/use-time-end';
import { PollGraph } from './PollGraph';
import styled from 'styled-components';
import { Schedule } from '@material-ui/icons';
import { PollList } from './types';

export interface GridProps extends PollList {
  className?: string;
}

function GridBase({ className, polls, onClick }: GridProps) {
  return (
    <div className={className}>
      <div className="grid">
        {polls.map((poll) => (
          <Section key={'grid' + poll.id} onClick={() => onClick(poll)}>
            <div className="poll-id">
              <span>ID: {poll.id}</span>
              <span>{poll.type}</span>
            </div>

            <div className="poll-status">{poll.status}</div>

            <h2>{poll.title}</h2>

            <PollGraph
              total={poll.vote.total}
              yes={poll.vote.yes}
              no={poll.vote.no}
              baseline={Math.floor(poll.vote.total * 0.45)}
            />

            <div className="poll-ends-in">
              <IconSpan>
                <b>Estimated end time</b>{' '}
                {poll.endsIn.toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                {poll.endsIn.toLocaleTimeString()} <Schedule />{' '}
                <TimeEnd endTime={poll.endsIn} />
              </IconSpan>
            </div>
          </Section>
        ))}
      </div>

      <BorderButton className="more">More</BorderButton>
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
`;
