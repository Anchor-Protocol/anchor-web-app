import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import {
  BroadcastableQueryOptions,
  QueryBroadcaster,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import React, { ComponentType, useState } from 'react';
import { SnackbarContainer } from './components/SnackbarContainer';
import { SnackbarContent } from './components/SnackbarContent';

export default {
  title: 'core/use-broadcastable-query/Broadcast When Unmounted',
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
  broadcastWhen: 'unmounted',
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

function NotificationHost({ onUnmount }: { onUnmount: () => void }) {
  const [fetch, result] = useBroadcastableQuery(params);

  return (
    <section>
      <nav
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
          gridGap: 10,
        }}
      >
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

        {result?.status === 'in-progress' && (
          <ActionButton style={{ width: 200 }} onClick={() => onUnmount()}>
            Unmount!
          </ActionButton>
        )}
      </nav>

      <article style={{ padding: 10 }}>
        {result?.status === 'in-progress' ? (
          <div>
            {result.status}: {result.params.a} + {result.params.b} = ?
          </div>
        ) : result?.status === 'done' ? (
          <div>
            {result.status}: {result.params.a} + {result.params.b} ={' '}
            {result.data.c}
          </div>
        ) : result?.status === 'error' ? (
          <div>{result.status}: Error!!!</div>
        ) : null}
      </article>
    </section>
  );
}

export const Broadcast_When_Unmounted = () => {
  const [mount, setMount] = useState(true);

  return (
    <div>
      {mount ? (
        <NotificationHost
          onUnmount={() => {
            setMount(false);
            setTimeout(() => setMount(true), 4000);
          }}
        />
      ) : (
        <p>Notification will be open by snackbar.</p>
      )}
    </div>
  );
};
