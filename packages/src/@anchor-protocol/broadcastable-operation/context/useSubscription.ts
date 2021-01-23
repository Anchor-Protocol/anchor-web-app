import { DependencyList, useEffect } from 'react';
import { useOperationBroadcaster } from './OperationBroadcaster';
import { EventType } from './types';

export function useSubscription(
  subscriber: (id: string, event: EventType) => void,
  deps: DependencyList,
) {
  const { subscribe } = useOperationBroadcaster();

  useEffect(() => {
    const teardown = subscribe(subscriber);
    return teardown;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
