import { useEffect, useRef } from 'react';
import { useOperationBroadcaster } from './OperationBroadcaster';
import { EventType } from './types';

export function useSubscription(
  subscriber: (id: string, event: EventType) => void,
) {
  const savedSubscriber = useRef(subscriber);

  useEffect(() => {
    savedSubscriber.current = subscriber;
  }, [subscriber]);

  const { subscribe } = useOperationBroadcaster();

  useEffect(() => {
    const teardown = subscribe((id: string, event: EventType) => {
      savedSubscriber.current(id, event);
    });
    return teardown;
  }, [subscribe]);
}
