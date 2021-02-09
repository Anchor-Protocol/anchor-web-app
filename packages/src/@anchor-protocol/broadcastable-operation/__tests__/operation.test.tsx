import {
  createOperationOptions,
  OperationBroadcaster,
  useOperation,
} from '@anchor-protocol/broadcastable-operation';
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
