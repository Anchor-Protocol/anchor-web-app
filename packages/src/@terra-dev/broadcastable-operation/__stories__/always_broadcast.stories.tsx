import {
  createBroadcastingOption,
  createOperationOptions,
  OperationBroadcaster,
  useBroadcasting,
  useOperation,
} from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import React, { ComponentType } from 'react';
import { FloatingContainer } from './fixtures/FloatingContainer';
import { lazy } from './fixtures/lazy';

export default {
  title: 'core/broadcastable-operation',
  decorators: [
    (Story: ComponentType) => (
      <OperationBroadcaster dependency={{}}>
        <Story />
        <Container />
      </OperationBroadcaster>
    ),
  ],
};

const operationOptions = createOperationOptions({
  broadcastWhen: 'always',
  pipe: ({ a }: { a: number }) => [
    (x: number) => lazy(x.toString(), 3000),
    (y: string) => lazy(parseInt(y) + a, 3000),
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

/**
 * story
 *
 * 1. When the option is `broadcastWhen: always` result is always render by `useBroadcasting()`
 */
export const Always_Broadcast = () => {
  const [exec1] = useOperation(operationOptions, { a: 30 });
  const [exec2] = useOperation(operationOptions, { a: 50 });

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => exec1(Math.floor(Math.random() * 100))}
      >
        Execute Operation 1
      </ActionButton>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => exec2(Math.floor(Math.random() * 100))}
      >
        Execute Operation 2
      </ActionButton>
    </div>
  );
};
