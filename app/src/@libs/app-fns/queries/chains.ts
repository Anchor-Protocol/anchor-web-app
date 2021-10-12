import { NetworkInfo } from '@terra-dev/wallet-types';

export function chains(): Promise<Record<string, NetworkInfo>> {
  return fetch('https://assets.terra.money/chains.json').then((res) =>
    res.json(),
  );
}
