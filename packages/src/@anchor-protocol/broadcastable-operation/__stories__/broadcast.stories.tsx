import {
  createBroadcastingOption,
  createOperationOptions,
  OperationBroadcaster,
  useBroadcasting,
  useOperation,
} from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import React, { ComponentType } from 'react';
import { FloatingContainer } from './fixtures/FloatingContainer';
import { lazy } from './fixtures/lazy';

export default {
  title: 'core/broadcastable-operation',
  decorators: [
    (Story: ComponentType) => (
      <OperationBroadcaster>
        <Story />
        <Container />
      </OperationBroadcaster>
    ),
  ],
};

const operationOptions = createOperationOptions({
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

const broadcastingOptions = createBroadcastingOption({
  map: ({ id, rendering }) => <li key={id}>{rendering}</li>,
  displayTime: 5000,
});

function Container() {
  const renderings = useBroadcasting(broadcastingOptions);
  return <FloatingContainer>{renderings}</FloatingContainer>;
}

export const Always_Broadcast = () => {
  const [operate1] = useOperation(operationOptions);
  const [operate2] = useOperation(operationOptions);

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
