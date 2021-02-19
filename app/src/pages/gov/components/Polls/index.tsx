import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@anchor-protocol/neumorphism-ui/components/BorderButton';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { useLocalStorage } from '@anchor-protocol/use-local-storage';
import { HOUR, MINUTE, SECOND } from '@anchor-protocol/use-time-end';
import { List, ViewModule } from '@material-ui/icons';
import { govPathname } from 'pages/gov/env';
import { ChangeEvent, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Grid as GridView } from './Grid';
import { List as ListView } from './List';
import { Poll } from './types';

export interface PollsProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const options: Item[] = [
  { label: 'All', value: 'all' },
  { label: 'Item1', value: 'item1' },
  { label: 'Item2', value: 'item2' },
];

const polls: Poll[] = [
  {
    id: 6,
    type: 'Gov Update',
    status: 'In Progress',
    title: 'Reduce voting period to 7 days',
    vote: {
      total: 100,
      yes: 45,
      no: 5,
    },
    endsIn: new Date(Date.now() + 10 * HOUR + 24 * SECOND),
  },
  {
    id: 5,
    type: 'Gov Update',
    status: 'In Progress',
    title: 'Reward Minsters bonus mAssets when the premium is too high',
    vote: {
      total: 100,
      yes: 5,
      no: 45,
    },
    endsIn: new Date(Date.now() + 22 * MINUTE + 24 * SECOND),
  },
  {
    id: 4,
    type: 'Gov Update',
    status: 'Passed',
    title: 'Reduce voting period to 7 days',
    vote: {
      total: 100,
      yes: 45,
      no: 5,
    },
    endsIn: new Date(Date.now() + 10 * HOUR + 24 * SECOND),
  },
  {
    id: 3,
    type: 'Gov Update',
    status: 'Rejected',
    title: 'Reduce voting period to 7 days',
    vote: {
      total: 100,
      yes: 45,
      no: 5,
    },
    endsIn: new Date(Date.now() + 10 * HOUR + 24 * SECOND),
  },
  {
    id: 2,
    type: 'Gov Update',
    status: 'Executed',
    title: 'Reduce voting period to 7 days',
    vote: {
      total: 100,
      yes: 45,
      no: 5,
    },
    endsIn: new Date(Date.now() + 10 * HOUR + 24 * SECOND),
  },
  {
    id: 1,
    type: 'Gov Update',
    status: 'Executed',
    title: 'Reduce voting period to 7 days',
    vote: {
      total: 100,
      yes: 45,
      no: 5,
    },
    endsIn: new Date(Date.now() + 10 * HOUR + 24 * SECOND),
  },
];

function PollsBase({ className }: PollsProps) {
  const [option, setOption] = useState<string>(() => options[0].value);

  const [view, setView] = useLocalStorage<'grid' | 'list'>(
    '__anchor_polls_view__',
    () => 'grid',
  );

  const onPollClick = useCallback((poll: Poll) => {
    console.log('index.tsx..()', poll);
  }, []);

  return (
    <section className={className}>
      <header>
        <h2>Polls</h2>

        <button
          className="icon-button"
          disabled={view === 'grid'}
          onClick={() => setView('grid')}
        >
          <ViewModule />
        </button>

        <button
          className="icon-button"
          disabled={view === 'list'}
          onClick={() => setView('list')}
        >
          <List />
        </button>

        <NativeSelect
          value={option}
          style={{ width: 150, height: 40, marginLeft: 10 }}
          onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
            setOption(target.value)
          }
        >
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>

        <div />

        <BorderButton
          component="a"
          href="https://google.com/"
          target="_blank"
          rel="noreferrer"
        >
          Join Forum
        </BorderButton>
        <ActionButton component={Link} to={`/${govPathname}/poll/create`}>
          Create Poll
        </ActionButton>
      </header>

      {view === 'grid' ? (
        <GridView polls={polls} onClick={onPollClick} />
      ) : (
        <ListView polls={polls} onClick={onPollClick} />
      )}
    </section>
  );
}

export const Polls = styled(PollsBase)`
  h2 {
    margin-right: 20px;
  }

  .icon-button {
    outline: none;
    border: 0;
    background-color: transparent;
    //background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;

    border-radius: 0;

    width: 30px;
    height: 30px;

    padding: 0;
    margin: 0 10px 0 0;

    svg {
      font-size: 1.9em;
      transform: translateY(0.1em);
    }

    color: ${({ theme }) => theme.textColor};
    opacity: 0.3;

    &:disabled {
      opacity: 1;
    }
  }
`;
