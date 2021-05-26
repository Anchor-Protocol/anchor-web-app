import { clearStoredSession, getStoredSession, storeSession } from './storage';
import { ReadonlyWalletSession } from './types';

export interface ReadonlyWalletController extends ReadonlyWalletSession {
  disconnect: () => void;
}

export interface ReadonlyWalletOptions extends ReadonlyWalletSession {}

export function connectIfSessionExists(): ReadonlyWalletController | null {
  const storedSession = getStoredSession();

  if (!!storedSession) {
    return connect(storedSession);
  }

  return null;
}

export function connect(
  options: ReadonlyWalletOptions,
): ReadonlyWalletController {
  storeSession(options);

  function disconnect() {
    clearStoredSession();
  }

  return {
    ...options,
    disconnect,
  };
}
