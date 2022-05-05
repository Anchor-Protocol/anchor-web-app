import { anchorToken } from '@anchor-protocol/types';
import {
  useAncBalanceQuery,
  useAnchorWebapp,
  useDeploymentTarget,
  useGovPollsQuery,
} from '@anchor-protocol/app-provider';
import { List, ViewModule } from '@material-ui/icons';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { NativeSelect } from '@libs/neumorphism-ui/components/NativeSelect';
import { links } from 'env';
import { pollStatusLabels } from 'pages/gov/components/formatPollStatus';
import { SubHeader } from 'pages/gov/components/SubHeader';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Grid as GridView } from './Grid';
import { List as ListView } from './List';
import { useLocalStorage } from 'usehooks-ts';
import { useGovStateQuery, useGovConfigQuery } from 'queries';

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
  const {
    target: { isNative },
  } = useDeploymentTarget();

  const navigate = useNavigate();

  const { contractAddress } = useAnchorWebapp();

  const [option, setOption] = useState<anchorToken.gov.PollStatus>(
    () => options[0].value,
  );

  const { polls, isLast, loadMore: loadMorePolls } = useGovPollsQuery(option);

  const { data: { ancBalance: govANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.gov,
  );

  const { data: govState } = useGovStateQuery();
  const { data: govConfig } = useGovConfigQuery();

  const [view, setView] = useLocalStorage<'grid' | 'list'>(
    '__anchor_polls_view__',
    'grid',
  );

  const onPollClick = useCallback(
    (poll: anchorToken.gov.PollResponse) => {
      navigate(`/poll/${poll.id}`);
    },
    [navigate],
  );

  return (
    <section className={className}>
      <SubHeader breakPoints={900}>
        <div>
          <NativeSelect
            className="filter"
            value={option}
            style={{ width: 150, height: 40 }}
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
          {isNative && (
            <ActionButton component={Link} to={`/poll/create`}>
              Create Poll
            </ActionButton>
          )}
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
  .filter {
    margin-right: 20px;
  }

  .icon-button {
    outline: none;
    border: 0;
    background-color: transparent;
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
