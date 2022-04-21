import { NetworkMoniker } from '@anchor-protocol/types';
import { LCDClient } from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/use-wallet';
import { createContext, useContext } from 'react';
import { getNetworkMoniker } from 'utils/getNetworkMoniker';

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

const LCDClients: Record<NetworkMoniker, LCDClient> = {
  [NetworkMoniker.Testnet]: new LCDClient({
    chainID: TESTNET.chainID,
    URL: TESTNET.lcd,
  }),
  [NetworkMoniker.Mainnet]: new LCDClient({
    chainID: MAINNET.chainID,
    URL: MAINNET.lcd,
  }),
  [NetworkMoniker.Local]: new LCDClient({
    chainID: 'localterra',
    // HTTPS: http://localhost:1338
    URL: 'http://localhost:1337',
  }),
};

export const NetworkContext = createContext<NetworkInfo>(MAINNET);

type UseNetworkReturn = {
  network: NetworkInfo;
  lcdClient: LCDClient;
  moniker: NetworkMoniker;
};

const useNetwork = (): UseNetworkReturn => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('The NetworkContext has not been defined.');
  }

  const moniker = getNetworkMoniker(context.chainID);

  return {
    network: context,
    lcdClient: LCDClients[moniker],
    moniker,
  };
};

export { useNetwork };
