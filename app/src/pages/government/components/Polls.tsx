import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@anchor-protocol/neumorphism-ui/components/BorderButton';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { useLocalStorage } from '@anchor-protocol/use-local-storage';
import { List, ViewModule } from '@material-ui/icons';
import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

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

function PollsBase({ className }: PollsProps) {
  const [option, setOption] = useState<string>(() => options[0].value);
  const [view, setView] = useLocalStorage<'grid' | 'list'>(
    '__anchor_polls_view__',
    () => 'grid',
  );

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

        <BorderButton>Join Forum</BorderButton>
        <ActionButton>Create Poll</ActionButton>
      </header>
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
