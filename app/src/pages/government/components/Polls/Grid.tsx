import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TimeEnd } from '@anchor-protocol/use-time-end';
import { PollGraph } from 'pages/government/components/Polls/PollGraph';
import styled from 'styled-components';
import { Schedule } from '@material-ui/icons';
import { PollList } from './types';

export interface GridProps extends PollList {
  className?: string;
}

function GridBase({ className, polls, onClick }: GridProps) {
  return (
    <div className={className}>
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
  );
}

export const Grid = styled(GridBase)`
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

    margin-bottom: 40px;
  }

  .poll-ends-in {
    margin-top: 45px;

    font-size: 13px;

    svg {
      margin: 0 5px 0 10px;
      transform: scale(1.4) translateY(0.07em);
    }
  }

  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-gap: 40px;

  .NeuSection-root {
    margin: 0;
    height: 374px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;
