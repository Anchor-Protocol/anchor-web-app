import { ApolloError, gql, useQuery } from '@apollo/client';
import { useAddressProvider } from '../../providers/address-provider';
import { MantleContractResponse, pickContractResult } from './types';

type ResponseWhitelistedValidators = string[];
const queryWhitelistedValidators = gql`
  query($contractAddress: String!, $queryMsg: String!) {
    BAssetWhitelistedValidators: WasmContractsContractAddressStore(
      ContractAddress: $contractAddress
      QueryMsg: $queryMsg
    ) {
      Height
      Result
    }
  }
`;

export default function useWhitelistedValidators(): [
  boolean,
  ApolloError | undefined,
  ResponseWhitelistedValidators,
] {
  const addressProvider = useAddressProvider();
  const { loading, error, data } = useQuery<{
    BAssetWhitelistedValidators: MantleContractResponse;
  }>(queryWhitelistedValidators, {
    variables: {
      contractAddress: addressProvider.bAssetGov('bluna'),
      queryMsg: JSON.stringify({ white_listed_validators: {} }),
    },
  });

  return [
    loading,
    error,
    data ? pickContractResult(data?.BAssetWhitelistedValidators) : [],
  ];
}
