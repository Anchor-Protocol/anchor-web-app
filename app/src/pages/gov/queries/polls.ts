import type { Num, uANC } from '@anchor-protocol/types';
import { ContractAddress } from '@anchor-protocol/types';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { parseResult } from 'queries/parseResult';
import { useCallback, useEffect, useState } from 'react';

export interface ExecuteMsg {
  contract: string;
  msg: string;
}

export type PollStatus = 'in_progress' | 'passed' | 'rejected' | 'executed';

export interface Poll {
  id: number;
  creator: string;
  status: PollStatus;
  end_height: number;
  title: string;
  description: string;
  link: string | null | undefined;
  deposit_amount: uANC<string>;
  execute_data: ExecuteMsg | null | undefined;
  no_votes: Num<string>;
  yes_votes: Num<string>;
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
  PollsQuery: string;
  Gov_contract: string;
}

export interface Variables {
  Gov_contract: string;
  PollsQuery: {
    polls: {
      filter?: PollStatus;
      start_after?: number;
      limit?: number;
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

const limit = 6;

export function usePolls(
  filter: PollStatus | undefined,
): [polls: Poll[], loadMore: () => void] {
  const client = useApolloClient();

  const address = useContractAddress();

  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    queryPolls(client, address, filter, undefined, limit).then(({ data }) => {
      if (data.polls?.polls) {
        setPolls(data.polls.polls);
      }
    });
  }, [address, client, filter]);

  const loadMore = useCallback(() => {
    if (polls.length > 0) {
      queryPolls(
        client,
        address,
        filter,
        polls[polls.length - 1].id,
        limit,
      ).then(({ data }) => {
        setPolls((prev) => {
          if (data.polls && Array.isArray(data.polls.polls)) {
            return [...prev, ...data.polls.polls];
          }
          return prev;
        });
      });
    }
  }, [address, client, filter, polls]);

  return [polls, loadMore];
}

export function queryPolls(
  client: ApolloClient<any>,
  address: ContractAddress,
  filter?: PollStatus,
  start_after?: number,
  limit?: number,
) {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        Gov_contract: address.anchorToken.gov,
        PollsQuery: {
          polls: {
            filter,
            start_after,
            limit,
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        data: map(result.data, dataMap),
      };
    });
}
