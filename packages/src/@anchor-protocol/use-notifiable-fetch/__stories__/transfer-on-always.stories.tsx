import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import {
  NotifiableFetchProvider,
  useNotifiableFetch,
} from '@anchor-protocol/use-notifiable-fetch';
import React, { ComponentType } from 'react';
import { SnackbarContainer } from './components/SnackbarContainer';
import { SnackbarContent } from './components/SnackbarContent';

export default {
  title: 'core/use-notifiable-fetch',
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

export const Transfer_On_Always = () => {
  const [fetch] = useNotifiableFetch<{ a: number; b: number }, { c: number }>({
    transferOn: 'always',
    fetchFactory: ({ a, b }) => {
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
  });

  return (
    <div>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => fetch({ a: 1, b: 2 })}
      >
        Fetch
      </ActionButton>
    </div>
  );
};
