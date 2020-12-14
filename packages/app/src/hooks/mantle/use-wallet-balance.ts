import { ApolloError, gql, useQuery } from "@apollo/client"
import { MantleRefetch, MantleResponseWithHeight, pickResult } from "./types"
import { useWallet } from "../use-wallet"

type ResponseBalance = { Denom: string, Amount: string}[]
const queryBalance = gql`
  query($address: String!) {
    Balances: BankBalancesAddress(
      Address: $address
    ) {
      Height
      Result {
        Denom
        Amount
      }
    }
  }
`

export default function useWalletBalance(): [
  boolean,
  ApolloError | undefined,
  ResponseBalance | null,
  MantleRefetch
] {
  const wallet = useWallet()
  const { loading, error, data, refetch } = useQuery<{
    Balances: MantleResponseWithHeight<ResponseBalance>
  }>(
    queryBalance, {
    variables: {
      address: wallet.address,
    }
  })

  return [
    loading,
    error,
    data ? pickResult(data.Balances) : null,
    () => refetch()
  ]
}