import { anchorToken, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import { MappedQueryResult } from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  poll: WASMContractResult;
}

export interface Data {
  poll: WASMContractResult<anchorToken.gov.PollResponse>;
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
  pollQuery: anchorToken.gov.Poll;
}

export function mapVariables({
  govContract,
  pollQuery,
}: Variables): RawVariables {
  return {
    govContract,
    pollQuery: JSON.stringify(pollQuery),
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

  const { anchorToken } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      govContract: anchorToken.gov,
      pollQuery: {
        poll: {
          poll_id: pollId,
        },
      },
    });
  }, [anchorToken.gov, pollId]);

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
