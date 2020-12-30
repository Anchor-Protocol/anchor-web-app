import { ApolloError, gql, useQuery } from '@apollo/client';
import { useWallet } from '../use-wallet';
import {
  MantleContractResponse,
  MantleRefetch,
  pickContractResult,
} from './types';

type ContractBalanceResponse = { balance: string };
const queryAnchorBalance = gql`
  query($contractAddress: String!, $queryMsg: String!) {
    contractBalance: WasmContractsContractAddressStore(
      ContractAddress: $contractAddress
      QueryMsg: $queryMsg
    ) {
      Height
      Result
    }
  }
`;

export default function useContractBalance(
  contractAddress: string,
): [boolean, ApolloError | undefined, ContractBalanceResponse, MantleRefetch] {
  //const addressProvider = useAddressProvider();
  const wallet = useWallet();
  console.log(
    'use-contract-balance.ts..useContractBalance()',
    contractAddress,
    JSON.stringify({ balance: { address: wallet.address } }),
  );
  const { loading, error, data, refetch } = useQuery<{
    contractBalance: MantleContractResponse;
  }>(queryAnchorBalance, {
    variables: {
      contractAddress: contractAddress,
      queryMsg: JSON.stringify({ balance: { address: wallet.address } }),
    },
  });

  console.log('use-contract-balance.ts..useContractBalance()', {
    loading,
    error,
    data,
  });

  return [
    loading,
    error,
    data ? pickContractResult(data?.contractBalance) : { balance: '0' },
    refetch,
  ];
}
