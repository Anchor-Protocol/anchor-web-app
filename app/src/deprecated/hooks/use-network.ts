import { FINDER } from 'env';
import useLocalStorage from 'deprecated/hooks/use-localstorage';
import networks, { NetworkKey, NetworkConfig } from 'deprecated/networks';
import createContext from 'deprecated/hooks/create-context';

interface Network extends NetworkConfig {
  /** Mainnet | Testnet */
  key: NetworkKey;
  /** Mainnet | Testnet */
  setKey: (key: NetworkKey) => void;

  /** Get finder link */
  finder: (address: string, path?: string) => string;
}

const context = createContext<Network>('useNetwork');
export const [useNetwork, NetworkProvider] = context;

/* state */
export const useNetworkState = (): Network => {
  const [key, setKey] = useLocalStorage('network', NetworkKey.TESTNET);
  const network = networks[key];

  const finder = (address: string, path = 'account') =>
    `${FINDER}/${network.id}/${path}/${address}`;

  return { ...network, key, setKey, finder };
};
