import { anchorToken } from '@anchor-protocol/types';
import { List, ViewModule } from '@material-ui/icons';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@terra-dev/neumorphism-ui/components/NativeSelect';
import { useLocalStorage } from '@terra-dev/use-local-storage';
import { links } from 'env';
import { pollStatusLabels } from 'pages/gov/components/formatPollStatus';
import { SubHeader } from 'pages/gov/components/SubHeader';
import { govPathname } from 'pages/gov/env';
import { usePolls } from 'pages/gov/queries/polls';
import { useTotalStaked } from 'pages/gov/queries/totalStaked';
import { ChangeEvent, useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Grid as GridView } from './Grid';
import { List as ListView } from './List';

export interface PollsProps {
  className?: string;
}

interface Item {
  label: string;
  value: anchorToken.gov.PollStatus;
}

const options: Item[] = [
  { label: pollStatusLabels['in_progress'], value: 'in_progress' },
  { label: pollStatusLabels['executed'], value: 'executed' },
  { label: pollStatusLabels['passed'], value: 'passed' },
  { label: pollStatusLabels['rejected'], value: 'rejected' },
];

function PollsBase({ className }: PollsProps) {
  const history = useHistory();

  const [option, setOption] = useState<anchorToken.gov.PollStatus>(
    () => options[0].value,
  );

  const [polls, isLast, loadMorePolls] = usePolls(option);

  const {
    data: { govANCBalance, govState, govConfig },
  } = useTotalStaked();

  const [view, setView] = useLocalStorage<'grid' | 'list'>(
    '__anchor_polls_view__',
    () => 'grid',
  );

  const onPollClick = useCallback(
    (poll: anchorToken.gov.PollResponse) => {
      history.push(`/${govPathname}/poll/${poll.id}`);
    },
    [history],
  );

  return (
    <section className={className}>
      <SubHeader breakPoints={900}>
        <div>
          <h2>
            <IconSpan>
              Polls{' '}
              <InfoTooltip>
                Staked ANC can be used to exercise voting power in polls that
                are currently in progress
              </InfoTooltip>
            </IconSpan>
          </h2>

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

          <div />

          <NativeSelect
            value={option}
            style={{ width: 150, height: 40, marginLeft: 10 }}
            onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
              setOption(target.value as anchorToken.gov.PollStatus)
            }
          >
            {options.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="buttons">
          <BorderButton
            component="a"
            href={links.forum}
            target="_blank"
            rel="noreferrer"
          >
            Join Forum
          </BorderButton>
          <ActionButton component={Link} to={`/${govPathname}/poll/create`}>
            Create Poll
          </ActionButton>
        </div>
      </SubHeader>

      {view === 'grid' ? (
        <GridView
          isLast={isLast}
          polls={polls}
          onClick={onPollClick}
          onLoadMore={loadMorePolls}
          govANCBalance={govANCBalance}
          govState={govState}
          govConfig={govConfig}
        />
      ) : (
        <ListView
          isLast={isLast}
          polls={polls}
          onClick={onPollClick}
          onLoadMore={loadMorePolls}
          govANCBalance={govANCBalance}
          govState={govState}
          govConfig={govConfig}
        />
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
