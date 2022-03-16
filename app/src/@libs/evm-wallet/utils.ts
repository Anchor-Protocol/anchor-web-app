import { availableConnections, availableConnectTypes } from './constants';
import { Connection, ConnectType } from './types';

export function getConnection(connectType: ConnectType): Connection | null {
  const isConnected = (availableConnectTypes as ReadonlyArray<string>).includes(
    connectType,
  );

  return isConnected
    ? availableConnections.find(({ type }) => type === connectType) || null
    : null;
}
