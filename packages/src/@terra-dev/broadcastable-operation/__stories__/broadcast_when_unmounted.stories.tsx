import {
  createBroadcastingOption,
  createOperationOptions,
  OperationBroadcaster,
  useBroadcasting,
  useOperation,
} from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import React, { ComponentType, useCallback, useState } from 'react';
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
  broadcastWhen: 'unmounted',
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

function Main() {
  const [exec, result] = useOperation(operationOptions, { a: 30 });

  return (
    <div>
      <section style={{ marginBottom: 20 }}>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </section>

      <section style={{ marginBottom: 20 }}>
        <ActionButton
          style={{ width: 200 }}
          onClick={() => exec(Math.floor(Math.random() * 100))}
        >
          Execute Operation
        </ActionButton>
      </section>
    </div>
  );
}

/**
 * story
 *
 * 1. When the the Component(<Main/>) is still be mounted the result will render on the Component itself
 * 2. But, If the Component(<Main/>) is unmount the result will render by `useBroadcasting()`
 */
export const Broadcast_When_Unmounted = () => {
  const [mount, setMount] = useState<boolean>(true);

  const unmount = useCallback(() => {
    setMount(false);
    setTimeout(() => setMount(true), 1000 * 20);
  }, []);

  return (
    <div>
      {mount && <Main />}

      <section>
        <ActionButton style={{ width: 200 }} onClick={unmount}>
          Unmount
        </ActionButton>
      </section>
    </div>
  );
};
