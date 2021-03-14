import { anchorToken, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'base/contexts/contract';
import { useService } from 'base/contexts/service';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  lpStakingState: WASMContractResult;
}

export interface Data {
  lpStakingState: WASMContractResult<anchorToken.staking.StateResponse>;
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
  LPStakingStateQuery: anchorToken.staking.State;
}

export function mapVariables({
  ANCUST_LP_Staking_contract,
  LPStakingStateQuery,
}: Variables): RawVariables {
  return {
    ANCUST_LP_Staking_contract,
    LPStakingStateQuery: JSON.stringify(LPStakingStateQuery),
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

  const { anchorToken } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      ANCUST_LP_Staking_contract: anchorToken.staking,
      LPStakingStateQuery: {
        state: {},
      },
    });
  }, [anchorToken.staking]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
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
