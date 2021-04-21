import { AccAddress } from '@terra-money/terra.js';
import { ReadonlyWalletSession } from './types';

const STORAGE_KEY = '__terra-readonly-wallet-storage-key__';

export function getStoredSession(): ReadonlyWalletSession | undefined {
  const storedSessionString = localStorage.getItem(STORAGE_KEY);

  if (!storedSessionString) return undefined;

  try {
    const storedSession = JSON.parse(storedSessionString);

    if (
      'terraAddress' in storedSession &&
      'network' in storedSession &&
      typeof storedSession['terraAddress'] === 'string' &&
      AccAddress.validate(storedSession.terraAddress)
    ) {
      return storedSession;
    } else {
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}

export function storeSession(session: ReadonlyWalletSession) {
  if (!AccAddress.validate(session.terraAddress)) {
    throw new Error(`${session.terraAddress} is not a terraAddress`);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEY);
}
