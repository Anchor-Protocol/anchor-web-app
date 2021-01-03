import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import {
  NotifiableFetchParams,
  NotifiableFetchProvider,
  useNotifiableFetch,
} from '@anchor-protocol/use-notifiable-fetch';
import React, { ComponentType } from 'react';
import { SnackbarContainer } from './components/SnackbarContainer';
import { SnackbarContent } from './components/SnackbarContent';

export default {
  title: 'core/use-notifiable-fetch/Polling',
  decorators: [
    (Story: ComponentType) => (
      <NotifiableFetchProvider>
        <SnackbarProvider>
          <Story />
          <SnackbarContainer />
        </SnackbarProvider>
      </NotifiableFetchProvider>
    ),
  ],
};

const mockFetch = () =>
  new Promise<number>((resolve) =>
    setTimeout(() => resolve(Math.random()), 500),
  );

const params: NotifiableFetchParams<
  { a: number; b: number },
  { c: number },
  Error
> = {
  transferOn: 'always',
  fetchFactory: async ({ a, b }) => {
    while (true) {
      const value = await mockFetch();

      if (value > 0.9) {
        return { c: a + b };
      } else if (value < 0.1) {
        throw new Error('Nooooooooooo....');
      } else {
        console.log('retry polling...');
      }
    }
  },
  notificationFactory: (result) => {
    switch (result.status) {
      case 'in-progress':
        return (
          <SnackbarContent
            message={`in progress: ${result.params.a} + ${result.params.b} = ?`}
          />
        );
      case 'done':
        return (
          <SnackbarContent
            message={`done: ${result.params.a} + ${result.params.b} = ${result.data.c}`}
          />
        );
      case 'error':
        return (
          <SnackbarContent message={`error: ${result.error.toString()}`} />
        );
      default:
        return <SnackbarContent message={`unknown case!!!`} />;
    }
  },
};

export const Polling = () => {
  const [fetch] = useNotifiableFetch(params);

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
