import { useOperationBroadcaster } from './OperationBroadcaster';
import { Rendering } from './types';

export function useRenderings(): Rendering[] {
  const { broadcastedRenderings } = useOperationBroadcaster();
  return broadcastedRenderings;
}
