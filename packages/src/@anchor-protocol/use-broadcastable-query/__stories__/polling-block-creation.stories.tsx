import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SnackbarProvider } from '@anchor-protocol/snackbar';
import {
  BroadcastableQueryOptions,
  QueryBroadcaster,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { SnackbarContent } from './components/SnackbarContent';
import React, { ComponentType, useCallback } from 'react';
import { SnackbarContainer } from './components/SnackbarContainer';

export default {
  title: 'core/use-broadcastable-query/Polling Block Creation',
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

const isBlockCreated = (txHash: string) =>
  new Promise<{ txHash: string; created: boolean | undefined }>((resolve) =>
    setTimeout(() => {
      const probabillity: number = Math.random();

      if (probabillity > 0.8) {
        resolve({ txHash, created: true });
      } else if (probabillity < 0.2) {
        resolve({ txHash, created: false });
      } else {
        resolve({ txHash, created: undefined });
      }
    }, 1000),
  );

const options: BroadcastableQueryOptions<
  { txHash: string },
  { txHash: string; created: true },
  Error
> = {
  broadcastWhen: 'always',
  fetchClient: async ({ txHash }) => {
    while (true) {
      const { created } = await isBlockCreated(txHash);

      if (created === true) {
        return { txHash, created };
      } else if (created === false) {
        throw new Error(`Failed block creation!`);
      } else {
        console.log('Retry...');
      }
    }
  },
  notificationFactory: (result) => {
    switch (result.status) {
      case 'in-progress':
        return (
          <SnackbarContent
            message={`Polling the block creation of "${result.params.txHash}"`}
          />
        );
      case 'done':
        return (
          <SnackbarContent
            message={`Block "${result.data.txHash}" is created!`}
          />
        );
      case 'error':
        return <SnackbarContent message={`error: ${result.error.message}`} />;
      default:
        return <SnackbarContent message={`unknown case!!!`} />;
    }
  },
};

export const Polling_Block_Creation = () => {
  const [fetch] = useBroadcastableQuery(options);

  const transct = useCallback(async () => {
    // transact to terra station
    const txHash: string = await new Promise((resolve) =>
      setTimeout(
        () => resolve('Block' + Math.floor(Math.random() * 1000000)),
        3000,
      ),
    );

    await fetch({ txHash });
  }, [fetch]);

  return (
    <div>
      <nav>
        <ActionButton style={{ width: 200 }} onClick={transct}>
          Transact to Terra Station
        </ActionButton>
      </nav>
    </div>
  );
};
