import { NetworkInfo } from '@terra-money/use-wallet';

export function chains(): Promise<Record<string, NetworkInfo>> {
  return fetch('https://assets.terra.money/chains.json').then((res) =>
    res.json(),
  );
}
