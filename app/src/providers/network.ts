import createContext from '../hooks/create-context';
import { NetworkConfig, NetworkKey } from '../networks';

interface Network extends NetworkConfig {
  /** Mainnet | Testnet */
  key: NetworkKey;
  /** Mainnet | Testnet */
  setKey: (key: NetworkKey) => void;

  /** Get finder link */
  finder: (address: string, path?: string) => string;
}

export const [useNetwork, NetworkProvider] = createContext<Network>('network');
