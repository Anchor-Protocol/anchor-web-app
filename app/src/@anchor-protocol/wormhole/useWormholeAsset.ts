import { ustFormatter } from '@anchor-protocol/formatter';
import { ChainId, hexToNativeString } from '@certusone/wormhole-sdk';
import { Token, u } from '@libs/types';
import { BigSource } from 'big.js';

const defaultFormatter = (amount: BigInt): string => {
  return amount.toString();
};

type Formatter = typeof defaultFormatter;

export interface WormholeAsset {
  name: string;
  formatter: Formatter;
}

const useWormholeAsset = (address: string, chainId: ChainId) => {
  const asset = hexToNativeString(address, chainId);
  switch (asset) {
    case 'uusd':
      return {
        name: 'UST',
        formatter: (amount: BigInt) =>
          ustFormatter(amount.toString() as u<Token<BigSource>>),
      };
  }
  return {
    name: address,
    formatter: defaultFormatter,
  };
};

export { useWormholeAsset };
