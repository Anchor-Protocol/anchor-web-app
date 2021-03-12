import { cw20, uANC, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import { MappedQueryResult } from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface RawData {
  communityAncBalance: WASMContractResult;
}

export interface Data {
  communityAncBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
}

export const dataMap = createMap<RawData, Data>({
  communityAncBalance: (existing, { communityAncBalance }) => {
    return parseResult(
      existing.communityAncBalance,
      communityAncBalance.Result,
    );
  },
});

export interface RawVariables {
  ANCTokenContract: string;
  CommunityANCBalanceQuery: string;
}

export interface Variables {
  ANCTokenContract: string;
  communityAddress: string;
}

export function mapVariables({
  ANCTokenContract,
  communityAddress,
}: Variables): RawVariables {
  return {
    ANCTokenContract,
    CommunityANCBalanceQuery: JSON.stringify({
      balance: {
        address: communityAddress,
      },
    }),
  };
}

export const query = gql`
  query __communityAncBalance(
    $ANCTokenContract: String!
    $CommunityANCBalanceQuery: String!
  ) {
    communityAncBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANCTokenContract
      QueryMsg: $CommunityANCBalanceQuery
    ) {
      Result
    }
  }
`;

export function useCommunityAncBalance(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable } = useService();

  const address = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      ANCTokenContract: address.cw20.ANC,
      communityAddress: address.anchorToken.community,
    });
  }, [address.anchorToken.community, address.cw20.ANC]);

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
