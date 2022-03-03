import { LCDClient } from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/use-wallet';
import { createContext, useContext } from 'react';

export const TESTNET: NetworkInfo = {
  name: 'testnet',
  chainID: 'bombay-12',
  lcd: 'https://bombay-lcd.terra.dev',
};

export const MAINNET: NetworkInfo = {
  name: 'mainnet',
  chainID: 'columbus-5',
  lcd: 'https://lcd.terra.dev',
};

const LCDClients: Record<string, LCDClient> = {
  testnet: new LCDClient({
    chainID: TESTNET.chainID,
    URL: TESTNET.lcd,
  }),
  mainnet: new LCDClient({
    chainID: MAINNET.chainID,
    URL: MAINNET.lcd,
  }),
};

export const NetworkContext = createContext<NetworkInfo>(MAINNET);

type UseNetworkReturn = {
  network: NetworkInfo;
  lcdClient: LCDClient;
};

const useNetwork = (): UseNetworkReturn => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('The NetworkContext has not been defined.');
  }
  return {
    network: context,
    lcdClient: LCDClients[context.name ?? 'mainnet'],
  };
};

export { useNetwork };
