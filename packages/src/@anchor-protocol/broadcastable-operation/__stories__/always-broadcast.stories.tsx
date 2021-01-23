import {
  createOperationOptions,
  OperationBroadcaster,
  useOperation,
} from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import React, { ComponentType } from 'react';
import { BroadcastingContainer } from './fixtures/BroadcastingContainer';
import { lazy } from './fixtures/lazy';

export default {
  title: 'core/broadcastable-operation/Always Broadcast',
  decorators: [
    (Story: ComponentType) => (
      <OperationBroadcaster>
        <Story />
        <BroadcastingContainer />
      </OperationBroadcaster>
    ),
  ],
};

const operation = createOperationOptions({
  broadcastWhen: 'always',
  pipe: [
    (x: number) => lazy(x.toString(), 3000),
    (y: string) => lazy(parseInt(y), 3000),
    (z: number) => lazy(z.toString(), 3000),
  ],
  renderBroadcast: (result) => {
    return <pre>{JSON.stringify(result, null, 2)}</pre>;
  },
});

export const Always_Broadcast = () => {
  const [operate1] = useOperation(operation);
  const [operate2] = useOperation(operation);

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => operate1(Math.floor(Math.random() * 100))}
      >
        Operation 1
      </ActionButton>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => operate2(Math.floor(Math.random() * 100))}
      >
        Operation 2
      </ActionButton>
    </div>
  );
};
