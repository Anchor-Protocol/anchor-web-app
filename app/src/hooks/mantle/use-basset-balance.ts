import { useAddressProvider } from '../../providers/address-provider';
import useContractBalance from './use-contract-balance';

export default function useBAssetBalance() {
  const addressProvider = useAddressProvider();
  return useContractBalance(addressProvider.bAssetToken('ubluna'));
}
