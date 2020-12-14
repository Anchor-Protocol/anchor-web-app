import { ApolloError, gql, useQuery } from "@apollo/client"
import { useAddressProvider } from '../../providers/address-provider'
import { MantleContractResponse, MantleRefetch, pickContractResult } from "./types"
import { useWallet } from "../use-wallet"

type ClaimableResponse = string
const querybAssetClaimable = gql`
  query($contractAddress: String!, $queryMsg: String!) {
    Claimable: WasmContractsContractAddressStore(
      ContractAddress: $contractAddress,
      QueryMsg: $queryMsg,
    ) {
      Height
      Result
    }
  }
`

export default function useBassetClaimable(): [
  boolean,
  ApolloError | undefined,
  ClaimableResponse,
  MantleRefetch,
] {

  const addressProvider = useAddressProvider()
  const wallet = useWallet()
  const { loading, error, data, refetch } = useQuery<{
    Claimable: MantleContractResponse
  }>(
    querybAssetClaimable, {
      variables: {
        contractAddress: addressProvider.bAssetReward('bluna'),
        queryMsg: JSON.stringify({ accrued_rewards: { address: wallet.address } })
      }
    }
  )

  return [
    loading,
    error,
    data ? pickContractResult(data?.Claimable) : "0",
    () => refetch()
  ]
}