# `@terra-dev/broadcastable-operation`

Composite functional operations and broadcasts the operation result when the host component is unmounted.

TODO

## Spec

<!-- source __tests__/*.test.tsx -->

[\_\_tests\_\_/operation.test.tsx](__tests__/operation.test.tsx)

```tsx
import {
  createOperationOptions,
  OperationBroadcaster,
  useOperation,
} from '@terra-dev/broadcastable-operation';
import { act, renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';

function lazy<T>(v: T) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(v), 100));
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <OperationBroadcaster dependency={{}}>{children}</OperationBroadcaster>
);

const options = createOperationOptions({
  pipe: () => [
    (x: number) => lazy(x.toString()),
    (y: string) => lazy(parseInt(y)),
    (z: number) => lazy(z.toString()),
  ],
  renderBroadcast: (result) => {
    switch (result.status) {
      case 'in-progress':
        return `${result.snapshots.join(',')}`;
      case 'done':
        return `${result.data}`;
      default:
        return null;
    }
  },
});

describe('broadcastable-operation', () => {
  test('should get result', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useOperation(options, {}),
      { wrapper },
    );

    expect(result.current[1]).toMatchObject({ status: 'ready' });

    act(() => {
      result.current[0](10);
    });

    expect(result.current[1]).toMatchObject({
      status: 'in-progress',
      snapshots: [10],
    });

    await waitForNextUpdate();

    expect(result.current[1]).toMatchObject({
      status: 'in-progress',
      snapshots: [10, '10'],
    });

    await waitForNextUpdate();

    expect(result.current[1]).toMatchObject({
      status: 'in-progress',
      snapshots: [10, '10', 10],
    });

    await waitForNextUpdate();

    expect(result.current[1]).toMatchObject({
      status: 'done',
      snapshots: [10, '10', 10, '10'],
      data: '10',
    });
  });
});
```

<!-- /source -->

## Stories

<!-- source __stories__/*.stories.tsx -->

[\_\_stories\_\_/abort_operation.stories.tsx](__stories__/abort_operation.stories.tsx)

```tsx
import {
  createBroadcastingOption,
  createOperationOptions,
  OperationBroadcaster,
  OperationDependency,
  useBroadcasting,
  useOperation,
} from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import React, { ComponentType } from 'react';
import { FloatingContainer } from './fixtures/FloatingContainer';

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

// dummy fetch
function fetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<{ json: () => Promise<{ c: number }> }> {
  return new Promise((resolve) => {
    const a = /a=([0-9]+)/.exec(input.toString());
    const b = /b=([0-9]+)/.exec(input.toString());

    if (!a || !b) {
      throw new Error('Undefined query a or b');
    }

    const timeout = setTimeout(() => {
      resolve({
        json: () =>
          Promise.resolve({
            c: parseInt(a[1]) + parseInt(b[1]),
          }),
      });
    }, 1000 * 10);

    init?.signal?.addEventListener('abort', () => {
      console.log('fetch() is aborted!!!!');
      clearTimeout(timeout);
    });
  });
}

const operationOptions = createOperationOptions({
  pipe: ({ signal }: OperationDependency) => [
    ({ a, b }: { a: number; b: number }) =>
      fetch(`http://dummy?a=${a}&b=${b}`, { signal }).then((res) => res.json()),
    ({ c }: { c: number }) => c,
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
 * 1. If result.status is 'in-progress' the result has `abort()` function
 * 2. `abort()` function is stop the operation immediately
 * 3. if the operator(fetch()) used the `signal: AbortSignal` the operator can be stop by the abort signal event immediately
 */
export const Abort_Operation = () => {
  const [operate, result] = useOperation(operationOptions, {});

  return (
    <div>
      <section style={{ marginBottom: 20 }}>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </section>

      <section>
        {result?.status === 'in-progress' ? (
          <ActionButton style={{ width: 200 }} onClick={() => result.abort()}>
            Abort Operation
          </ActionButton>
        ) : (
          <ActionButton
            style={{ width: 200 }}
            onClick={() => operate({ a: 1, b: 2 })}
          >
            Operation
          </ActionButton>
        )}
      </section>
    </div>
  );
};
```

[\_\_stories\_\_/always_broadcast.stories.tsx](__stories__/always_broadcast.stories.tsx)

```tsx
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
```

[\_\_stories\_\_/broadcast_when_unmounted.stories.tsx](__stories__/broadcast_when_unmounted.stories.tsx)

```tsx
import {
  createBroadcastingOption,
  createOperationOptions,
  OperationBroadcaster,
  useBroadcasting,
  useOperation,
} from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
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
```

<!-- /source -->
