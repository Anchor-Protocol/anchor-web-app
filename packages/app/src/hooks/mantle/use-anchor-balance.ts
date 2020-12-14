import { useAddressProvider } from '../../providers/address-provider'
import useContractBalance from "./use-contract-balance"

export default function useAnchorBalance() {
  const addressProvider = useAddressProvider()
  return useContractBalance(addressProvider.aToken('aUST'))
}