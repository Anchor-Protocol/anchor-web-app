import { AnchorNetwork } from '@anchor-protocol/types';
import { LCDClient } from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/use-wallet';
import { createContext, useContext } from 'react';
import { getAnchorNetwork } from 'utils/getAnchorNetwork';

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

const LCDClients: Record<AnchorNetwork, LCDClient> = {
  [AnchorNetwork.Test]: new LCDClient({
    chainID: TESTNET.chainID,
    URL: TESTNET.lcd,
  }),
  [AnchorNetwork.Main]: new LCDClient({
    chainID: MAINNET.chainID,
    URL: MAINNET.lcd,
  }),
  [AnchorNetwork.Local]: new LCDClient({
    chainID: 'localterra',
    // HTTPS: http://localhost:1338
    URL: 'http://localhost:1337',
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

  const anchorNetwork = getAnchorNetwork(context.chainID);

  return {
    network: context,
    lcdClient: LCDClients[anchorNetwork],
  };
};

export { useNetwork };
