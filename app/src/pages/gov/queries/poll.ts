import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { Poll } from 'pages/gov/queries/polls';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  poll: {
    Result: string;
  };
}

export interface Data {
  poll: {
    Result: string;
  } & Poll;
}

export const dataMap = createMap<RawData, Data>({
  poll: (existing, { poll }) => {
    return parseResult(existing.poll, poll.Result);
  },
});

export interface RawVariables {
  govContract: string;
  pollQuery: string;
}

export interface Variables {
  govContract: string;
  poll_id: number;
}

export function mapVariables({
  govContract,
  poll_id,
}: Variables): RawVariables {
  return {
    govContract,
    pollQuery: JSON.stringify({
      poll: {
        poll_id,
      },
    }),
  };
}

export const query = gql`
  query __poll($govContract: String!, $pollQuery: String!) {
    poll: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $pollQuery
    ) {
      Result
    }
  }
`;

export function usePoll(
  pollId: number,
): MappedQueryResult<RawVariables, RawData, Data> {
  const { serviceAvailable } = useService();

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      govContract: addressProvider.gov(),
      poll_id: pollId,
    });
  }, [addressProvider, pollId]);

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
