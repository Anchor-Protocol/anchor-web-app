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
  title: 'core/use-broadcastable-query/Always Broadcast',
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

const params: BroadcastableQueryOptions<
  { a: number; b: number },
  { c: number },
  Error
> = {
  broadcastWhen: 'always',
  fetchClient: ({ a, b }) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ c: a + b }), 3000);
    });
  },
  notificationFactory: (result) => {
    switch (result.status) {
      case 'in-progress':
        return (
          <SnackbarContent
            message={`${result.status} : ${result.params.a} + ${result.params.b} = ?`}
          />
        );
      case 'done':
        return (
          <SnackbarContent
            message={`${result.status} : ${result.params.a} + ${result.params.b} = ${result.data.c}`}
          />
        );
      case 'error':
        return <SnackbarContent message={`${result.status} : Error!!!`} />;
      default:
        return (
          <SnackbarContent message={`${result.status} : Unknown case!!!`} />
        );
    }
  },
};

export const Always_Broadcast = () => {
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
