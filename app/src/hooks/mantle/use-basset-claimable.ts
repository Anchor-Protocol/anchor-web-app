import { isConnected, useWallet } from '@anchor-protocol/wallet-provider';
import { ApolloError, gql, useQuery } from '@apollo/client';
import { useAddressProvider } from '../../providers/address-provider';
import {
  MantleContractResponse,
  MantleRefetch,
  pickContractResult,
} from './types';
//import { useWallet } from '../use-wallet';

type ClaimableResponse = string;
const querybAssetClaimable = gql`
  query($contractAddress: String!, $queryMsg: String!) {
    Claimable: WasmContractsContractAddressStore(
      ContractAddress: $contractAddress
      QueryMsg: $queryMsg
    ) {
      Height
      Result
    }
  }
`;

export default function useBassetClaimable(): [
  boolean,
  ApolloError | undefined,
  ClaimableResponse,
  MantleRefetch,
] {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const { loading, error, data, refetch } = useQuery<{
    Claimable: MantleContractResponse;
  }>(querybAssetClaimable, {
    skip: !isConnected(status),
    variables: {
      contractAddress: addressProvider.bAssetReward('bluna'),
      queryMsg: JSON.stringify({
        accrued_rewards: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      }),
    },
  });

  return [
    loading,
    error,
    data ? pickContractResult(data?.Claimable) : '0',
    () => refetch(),
  ];
}
