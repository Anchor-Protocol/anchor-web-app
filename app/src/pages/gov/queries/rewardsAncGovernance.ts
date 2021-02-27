import type { uANC } from '@anchor-protocol/types';
import { anchorToken, cw20, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  userGovStakingInfo: WASMContractResult;
  userANCBalance: WASMContractResult;
}

export interface Data {
  userGovStakingInfo: WASMContractResult<anchorToken.gov.StakerResponse>;
  userANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
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
  UserGovStakeInfoQuery: anchorToken.gov.Staker;
  UserANCBalanceQuery: cw20.Balance;
}

export function mapVariables({
  ANC_Gov_contract,
  ANC_token_contract,
  UserANCBalanceQuery,
  UserGovStakeInfoQuery,
}: Variables): RawVariables {
  return {
    ANC_Gov_contract,
    UserGovStakeInfoQuery: JSON.stringify(UserGovStakeInfoQuery),
    ANC_token_contract,
    UserANCBalanceQuery: JSON.stringify(UserANCBalanceQuery),
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

  const { anchorToken, cw20 } = useContractAddress();

  const variables = useMemo(() => {
    if (!walletReady) return undefined;

    return mapVariables({
      ANC_Gov_contract: anchorToken.gov,
      ANC_token_contract: cw20.ANC,
      UserGovStakeInfoQuery: {
        staker: {
          address: walletReady.walletAddress,
        },
      },
      UserANCBalanceQuery: {
        balance: {
          address: walletReady.walletAddress,
        },
      },
    });
  }, [anchorToken.gov, cw20.ANC, walletReady]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !variables || !serviceAvailable,
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
