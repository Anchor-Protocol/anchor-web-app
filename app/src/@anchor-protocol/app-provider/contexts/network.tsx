import { NetworkInfo } from '@terra-money/use-wallet';
import { createContext, useContext } from 'react';

export const TESTNET = {
  name: 'testnet',
  chainID: 'bombay-12',
  lcd: 'https://bombay-lcd.terra.dev',
};

export const MAINNET = {
  name: 'mainnet',
  chainID: 'columbus-5',
  lcd: 'https://lcd.terra.dev',
};

export const NetworkContext = createContext<NetworkInfo>(MAINNET);

const useNetwork = (): NetworkInfo => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('The NetworkContext has not been defined.');
  }
  return context;
};

export { useNetwork };
