import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import {
  BroadcastableQueryOptions,
  QueryBroadcaster,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { ComponentType } from 'react';
import { SnackbarContainer } from './components/SnackbarContainer';
import { SnackbarContent } from './components/SnackbarContent';

export default {
  title: 'core/use-broadcastable-query/Polling And Abort',
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

const mockFetch = () =>
  new Promise<number>((resolve) =>
    setTimeout(() => resolve(Math.random()), 1500),
  );

class AbortError extends Error {}

class TimeoutError extends Error {}

const params: BroadcastableQueryOptions<
  { a: number; b: number },
  { c: number },
  Error
> = {
  broadcastWhen: 'always',
  fetchClient: async ({ a, b }, { signal }) => {
    // TODO Polling 1. timeout 10s
    const timeout = Date.now() + 1000 * 10;

    // TODO Polling 2. loop
    while (Date.now() < timeout) {
      // TODO Polling 3. fetch data
      const value = await mockFetch();

      // TODO Abort 2. catch aborted signal
      if (signal.aborted) {
        throw new AbortError();
      } else if (value > 0.9) {
        return { c: a + b };
      } else if (value < 0.1) {
        throw new Error('Nooooooooooo....');
      } else {
        console.log('retry polling...');
      }
    }

    // TODO Polling 4. polling timeout
    throw new TimeoutError();
  },
  notificationFactory: (result) => {
    switch (result.status) {
      case 'in-progress':
        return (
          <SnackbarContent
            message={`in progress: ${result.params.a} + ${result.params.b} = ?`}
            action={[
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                onClick={() => result.abortController.abort()} // TODO Abort 1. user can abort the fetch
              >
                <Close />
              </IconButton>,
            ]}
          />
        );
      case 'done':
        return (
          <SnackbarContent
            message={`done: ${result.params.a} + ${result.params.b} = ${result.data.c}`}
          />
        );
      case 'error':
        return result.error instanceof AbortError ? (
          // TODO Abort 3. print aborted message
          <SnackbarContent message={`aborted`} />
        ) : result.error instanceof TimeoutError ? (
          // TODO Polling 5. print timeout message
          <SnackbarContent message={`timeout`} />
        ) : (
          <SnackbarContent message={`error: ${result.error.message}`} />
        );
      default:
        return <SnackbarContent message={`unknown case!!!`} />;
    }
  },
};

export const Polling_And_Abort = () => {
  const [fetch] = useBroadcastableQuery(params);

  return (
    <div>
      <nav>
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
      </nav>
    </div>
  );
};
