import { useAddressProvider } from 'contexts/contract';
import useContractBalance from 'deprecated/hooks/mantle/use-contract-balance';

export default function useBAssetBalance() {
  const addressProvider = useAddressProvider();
  return useContractBalance(addressProvider.bAssetToken('ubluna'));
}
