import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  allHistory: WASMContractResult;
  parameters: WASMContractResult;
}

export interface Data {
  allHistory: WASMContractResult<bluna.hub.AllHistoryResponse>;
  parameters: WASMContractResult<bluna.hub.ParametersResponse>;
}

export const dataMap = createMap<RawData, Data>({
  allHistory: (existing, { allHistory }) => {
    return parseResult(existing.allHistory, allHistory.Result);
  },
  parameters: (existing, { parameters }) => {
    return parseResult(existing.parameters, parameters.Result);
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    allHistory: {
      Result: '',
    },
    parameters: {
      Result: '',
    },
  },
  allHistory: undefined,
  parameters: undefined,
};

export interface RawVariables {
  bLunaHubContract: string;
  allHistory: string;
  parameters: string;
}

export interface Variables {
  bLunaHubContract: string;
  allHistory: bluna.hub.AllHistory;
  parameters: bluna.hub.Parameters;
}

export function mapVariables({
  bLunaHubContract,
  allHistory,
  parameters,
}: Variables): RawVariables {
  return {
    bLunaHubContract,
    allHistory: JSON.stringify(allHistory),
    parameters: JSON.stringify(parameters),
  };
}

export const query = gql`
  query __withdrawHistory(
    $bLunaHubContract: String!
    $allHistory: String!
    $parameters: String!
  ) {
    allHistory: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $allHistory
    ) {
      Result
    }

    parameters: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $parameters
    ) {
      Result
    }
  }
`;

export function useWithdrawHistory({
  withdrawRequestsStartFrom,
}: {
  withdrawRequestsStartFrom?: number;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const { bluna } = useContractAddress();

  const { online } = useService();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: bluna.hub,
      allHistory: {
        all_history: {
          start_from: withdrawRequestsStartFrom ?? 0,
          limit: 100,
        },
      },
      parameters: {
        parameters: {},
      },
    });
  }, [bluna.hub, withdrawRequestsStartFrom]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip:
      !online ||
      typeof withdrawRequestsStartFrom !== 'number' ||
      withdrawRequestsStartFrom < 0,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
    onError,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data: online ? data : mockupData,
    refetch,
  };
}
