import { AccAddress } from '@terra-money/terra.js';

export const storage = localStorage;

export const WALLET_ADDRESS: string = '__anchor_terra_station_wallet_address__';

export function getStoredAddress(): string | null {
  const address = storage.getItem(WALLET_ADDRESS);
  return address && AccAddress.validate(address) ? address : null;
}

export function storeAddress(address: string) {
  if (!AccAddress.validate(address)) {
    throw new Error(`${address} is invalidate terra address!`);
  }

  storage.setItem(WALLET_ADDRESS, address);
}

export function clearStore() {
  storage.removeItem(WALLET_ADDRESS);
}
