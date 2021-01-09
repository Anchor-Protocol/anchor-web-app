// import { useMutation } from "@apollo/client"
import { useWallet as useWallet2 } from '@anchor-protocol/wallet-provider';
// import { CONNECT } from "../statistics/gqldocs"
// import { useStatsClient } from "../statistics/useStats"

interface Wallet {
  /** Terra wallet address */
  address: string;
  /** Set as installed */
  install: () => void;
  /** Extension installed */
  installed: boolean;
  /** Connect wallet */
  connect: () => void;
  /** Disconnect wallet */
  disconnect: () => void;
}

//export const [useWallet] = createContext<Wallet>('useWallet');

/**
 * @deprecated use instead of useWallet() of @anchor-protocol/wallet-provider
 */
export function useWallet(): Wallet {
  const { status, install, connect, disconnect } = useWallet2();
  
  return {
    address: status.status === 'ready' ? status.walletAddress : '',
    install,
    connect,
    disconnect,
    installed: status.status !== 'not_installed',
  };
}

///* state */
//export const useWalletState = (): Wallet => {
//  /* init */
//  const init = extension.init();
//  const [installed, setInstalled] = useLocalStorage('extension', init);
//  const install = () => setInstalled(true);
//
//  /* connect */
//  const [address, setAddress] = useLocalStorage('address', '');
//
//  // const client = useStatsClient()
//  // const [connectToGraph] = useMutation(CONNECT, { client })
//  const connect = () =>
//    extension.connect(({ address }) => {
//      setAddress(address);
//      // connectToGraph({ variables: { address } })
//    });
//
//  const disconnect = () => setAddress('');
//
//  return { address, install, installed, connect, disconnect };
//};
