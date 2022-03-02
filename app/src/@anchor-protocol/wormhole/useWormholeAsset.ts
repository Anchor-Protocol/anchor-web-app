import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { ChainId, hexToNativeString } from '@certusone/wormhole-sdk';
import { Token, u } from '@libs/types';
import { BigSource } from 'big.js';

const defaultFormatter = (amount: string): string => {
  return amount.toString();
};

type Formatter = typeof defaultFormatter;

export interface WormholeAsset {
  name: string;
  formatter: Formatter;
}

const useWormholeAsset = (address: string, chainId: ChainId) => {
  const asset = hexToNativeString(address, chainId);

  const {
    ust: { demicrofy, formatOutput },
  } = useFormatters();
  switch (asset) {
    case 'uusd':
      return {
        name: 'UST',
        formatter: (amount: string) =>
          formatOutput(demicrofy(amount as u<Token<BigSource>>)),
      };
  }
  return {
    name: address,
    formatter: defaultFormatter,
  };
};

export { useWormholeAsset };
