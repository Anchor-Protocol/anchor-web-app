import createContext from '../hooks/create-context';
import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider/provider';

export const [
  useAddressProvider,
  AddressProviderProvider,
] = createContext<AddressProvider>('addressProvider');
