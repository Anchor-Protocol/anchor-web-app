import { Num, uUST } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface Poll {
  creator: string;
  deposit_amount: uUST<string>;
  description: Num<string>;
  end_height: number;
  execute_data: null;
  id: number;
  link: string | null;
  no_votes: Num<string>;
  yes_votes: Num<string>;
  status: 'rejected' | 'passed' | 'in-progress' | 'executed';
  title: string;
  total_balance_at_end_poll: Num<string>;
}

export interface RawData {
  polls: {
    Result: string;
  };
}

export interface Data {
  polls: {
    Result: string;
    polls: Poll[];
  };
}

export const dataMap = createMap<RawData, Data>({
  polls: (existing, { polls }) => {
    return parseResult(existing.polls, polls.Result);
  },
});

export interface RawVariables {
  Gov_contract: string;
  PollsQuery: string;
}

export interface Variables {
  Gov_contract: string;
  PollsQuery: {
    polls: {
      limit: number;
    };
  };
}

export function mapVariables({
  Gov_contract,
  PollsQuery,
}: Variables): RawVariables {
  return {
    Gov_contract,
    PollsQuery: JSON.stringify(PollsQuery),
  };
}

export const query = gql`
  query __polls($Gov_contract: String!, $PollsQuery: String!) {
    polls: WasmContractsContractAddressStore(
      ContractAddress: $Gov_contract
      QueryMsg: $PollsQuery
    ) {
      Result
    }
  }
`;

export function usePolls(): MappedQueryResult<RawVariables, RawData, Data> {
  const { serviceAvailable } = useService();

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      Gov_contract: addressProvider.gov(),
      PollsQuery: {
        polls: {
          limit: 6,
        },
      },
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
