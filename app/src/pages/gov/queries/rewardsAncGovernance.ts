import { Num, uANC } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  userGovStakingInfo: {
    Result: string;
  };

  userANCBalance: {
    Result: string;
  };
}

export interface Data {
  userGovStakingInfo: {
    Result: string;
    balance: Num<string>;
    locked_balance: [number, { balance: Num<string>; vote: string }][];
    share: Num<string>;
  };

  userANCBalance: {
    Result: string;
    balance: uANC<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  userGovStakingInfo: (existing, { userGovStakingInfo }) => {
    return parseResult(existing.userGovStakingInfo, userGovStakingInfo.Result);
  },

  userANCBalance: (existing, { userANCBalance }) => {
    return parseResult(existing.userANCBalance, userANCBalance.Result);
  },
});

export interface RawVariables {
  ANC_Gov_contract: string;
  UserGovStakeInfoQuery: string;
  ANC_token_contract: string;
  UserANCBalanceQuery: string;
}

export interface Variables {
  ANC_Gov_contract: string;
  ANC_token_contract: string;
  userWalletAddress: string;
}

export function mapVariables({
  ANC_Gov_contract,
  ANC_token_contract,
  userWalletAddress,
}: Variables): RawVariables {
  return {
    ANC_Gov_contract,
    UserGovStakeInfoQuery: JSON.stringify({
      staker: { address: userWalletAddress },
    }),
    ANC_token_contract,
    UserANCBalanceQuery: JSON.stringify({
      balance: { address: userWalletAddress },
    }),
  };
}

export const query = gql`
  query __rewardsAncGovernance(
    $ANC_Gov_contract: String!
    $UserGovStakeInfoQuery: String!
    $ANC_token_contract: String!
    $UserANCBalanceQuery: String!
  ) {
    userGovStakingInfo: WasmContractsContractAddressStore(
      ContractAddress: $ANC_Gov_contract
      QueryMsg: $UserGovStakeInfoQuery
    ) {
      Result
    }

    userANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $UserANCBalanceQuery
    ) {
      Result
    }
  }
`;

export function useRewardsAncGovernance(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable, walletReady } = useService();

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      ANC_Gov_contract: addressProvider.gov(),
      ANC_token_contract: addressProvider.ANC(),
      userWalletAddress: walletReady?.walletAddress ?? '',
    });
  }, [addressProvider, walletReady?.walletAddress]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    //pollInterval: 1000 * 60,
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
