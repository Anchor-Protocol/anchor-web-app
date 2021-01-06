import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import {
  BroadcastableQueryOptions,
  QueryBroadcaster,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import React, { ComponentType } from 'react';
import { SnackbarContainer } from './components/SnackbarContainer';
import { SnackbarContent } from './components/SnackbarContent';

export default {
  title: 'core/use-broadcastable-query/In Progress Update',
  decorators: [
    (Story: ComponentType) => (
      <QueryBroadcaster>
        <SnackbarProvider>
          <Story />
          <SnackbarContainer />
        </SnackbarProvider>
      </QueryBroadcaster>
    ),
  ],
};

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type Params = { a: number; b: number };
type Result = {
  plus: number;
  minus: number;
  multiply: number;
  division: number;
};

const params: BroadcastableQueryOptions<Params, Result, Error> = {
  broadcastWhen: 'always',
  fetchClient: async ({ a, b }, { inProgressUpdate }) => {
    await timeout(2000);

    const plus: Pick<Result, 'plus'> = { plus: a + b };
    inProgressUpdate(plus);

    await timeout(2000);

    const minus: Pick<Result, 'plus' | 'minus'> = { ...plus, minus: a - b };
    inProgressUpdate(minus);

    await timeout(2000);

    const multiply: Pick<Result, 'plus' | 'minus' | 'multiply'> = {
      ...minus,
      multiply: a * b,
    };
    inProgressUpdate(multiply);

    await timeout(2000);

    return { ...multiply, division: a / b };
  },
  notificationFactory: (result) => {
    switch (result.status) {
      case 'in-progress':
      case 'done':
        const message = (
          <div>
            <p>{result.status}</p>
            {typeof result.data?.plus === 'number' && (
              <p>
                {result.params.a} + {result.params.b} = {result.data.plus}
              </p>
            )}
            {typeof result.data?.minus === 'number' && (
              <p>
                {result.params.a} - {result.params.b} = {result.data.minus}
              </p>
            )}
            {typeof result.data?.multiply === 'number' && (
              <p>
                {result.params.a} * {result.params.b} = {result.data.multiply}
              </p>
            )}
            {typeof result.data?.division === 'number' && (
              <p>
                {result.params.a} / {result.params.b} = {result.data.division}
              </p>
            )}
            {result.status === 'in-progress' && <p>...</p>}
          </div>
        );
        return <SnackbarContent message={message} />;
      case 'error':
        return <SnackbarContent message={`${result.status} : Error!!!`} />;
      default:
        return (
          <SnackbarContent message={`${result.status} : Unknown case!!!`} />
        );
    }
  },
};

export const In_Progress_Update = () => {
  const [fetch] = useBroadcastableQuery(params);

  return (
    <div>
      <ActionButton
        style={{ width: 200 }}
        onClick={() =>
          fetch({
            a: Math.floor(Math.random() * 10),
            b: Math.floor(Math.random() * 10),
          })
        }
      >
        Fetch
      </ActionButton>
    </div>
  );
};
