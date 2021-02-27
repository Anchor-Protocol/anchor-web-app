import type { Num } from '@anchor-protocol/types';
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
  lpStakingState: {
    Result: string;
  };
}

export interface Data {
  lpStakingState: {
    Result: string;
    global_reward_index: Num<string>;
    last_distributed: number;
    total_bond_amount: Num<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  lpStakingState: (existing, { lpStakingState }) => {
    return parseResult(existing.lpStakingState, lpStakingState.Result);
  },
});

export interface RawVariables {
  ANCUST_LP_Staking_contract: string;
  LPStakingStateQuery: string;
}

export interface Variables {
  ANCUST_LP_Staking_contract: string;
}

export function mapVariables({
  ANCUST_LP_Staking_contract,
}: Variables): RawVariables {
  return {
    ANCUST_LP_Staking_contract,
    LPStakingStateQuery: JSON.stringify({
      state: {},
    }),
  };
}

export const query = gql`
  query __lpStakingState(
    $ANCUST_LP_Staking_contract: String!
    $LPStakingStateQuery: String!
  ) {
    lpStakingState: WasmContractsContractAddressStore(
      ContractAddress: $ANCUST_LP_Staking_contract
      QueryMsg: $LPStakingStateQuery
    ) {
      Result
    }
  }
`;

export function useLPStakingState(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable } = useService();

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      ANCUST_LP_Staking_contract: addressProvider.staking(),
    });
  }, [addressProvider]);

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
