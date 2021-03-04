import {
  anchorToken,
  ContractAddress,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { parseResult } from 'queries/parseResult';
import { useCallback, useEffect, useState } from 'react';

export interface RawData {
  polls: WASMContractResult;
}

export interface Data {
  polls: WASMContractResult<anchorToken.gov.PollsResponse>;
}

export const dataMap = createMap<RawData, Data>({
  polls: (existing, { polls }) => {
    polls?.Result &&
      console.log(
        JSON.stringify(
          //@ts-ignore
          JSON.parse(polls.Result).polls.map(({ execute_data, ...poll }) => ({
            //@ts-ignore
            execute_data: execute_data.map(({ msg }) => atob(msg)),
            ...poll,
          })),
          null,
          2,
        ),
      );
    return parseResult(existing.polls, polls.Result);
  },
});

export interface RawVariables {
  PollsQuery: string;
  Gov_contract: string;
}

export interface Variables {
  Gov_contract: string;
  PollsQuery: anchorToken.gov.Polls;
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
  filter: anchorToken.gov.PollStatus | undefined,
): [polls: anchorToken.gov.PollResponse[], loadMore: () => void] {
  const client = useApolloClient();

  const address = useContractAddress();

  const [polls, setPolls] = useState<anchorToken.gov.PollResponse[]>([]);

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
  filter?: anchorToken.gov.PollStatus,
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
