import { AddressProvider } from '@anchor-protocol/anchor.js';
import { Num, Ratio, uUST } from '@anchor-protocol/notation';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
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
  deposit_amount: uUST<string>;
  execute_data: ExecuteMsg | null | undefined;
  no_votes: Num<string>;
  yes_votes: Num<string>;
  total_balance_at_end_poll: Num<string>;
}

export interface GovConfig {
  Result: string;
  anchor_token: string;
  expiration_period: number;
  owner: string;
  proposal_deposit: uUST<string>;
  quorum: Ratio<string>;
  snapshot_period: number;
  threshold: Ratio<string>;
  timelock_period: number;
  voting_period: number;
}

export interface RawData {
  polls: {
    Result: string;
  };

  govConfig: {
    Result: string;
  };
}

export interface Data {
  polls: {
    Result: string;
    polls: Poll[];
  };

  govConfig: GovConfig;
}

export const dataMap = createMap<RawData, Data>({
  polls: (existing, { polls }) => {
    return parseResult(existing.polls, polls.Result);
  },

  govConfig: (existing, { govConfig }) => {
    return parseResult(existing.govConfig, govConfig.Result);
  },
});

export interface RawVariables {
  Gov_contract: string;
  PollsQuery: string;
  GovConfigQuery: string;
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
    GovConfigQuery: JSON.stringify({
      config: {},
    }),
  };
}

export const query = gql`
  query __polls(
    $Gov_contract: String!
    $PollsQuery: String!
    $GovConfigQuery: String!
  ) {
    polls: WasmContractsContractAddressStore(
      ContractAddress: $Gov_contract
      QueryMsg: $PollsQuery
    ) {
      Result
    }

    govConfig: WasmContractsContractAddressStore(
      ContractAddress: $Gov_contract
      QueryMsg: $GovConfigQuery
    ) {
      Result
    }
  }
`;

const limit = 6;

export function usePolls(
  filter: PollStatus | undefined,
): [
  polls: Poll[],
  govConfig: Data['govConfig'] | undefined,
  loadMore: () => void,
] {
  const client = useApolloClient();

  const addressProvider = useAddressProvider();

  const [polls, setPolls] = useState<Poll[]>([]);

  const [govConfig, setGovConfig] = useState<Data['govConfig'] | undefined>();

  useEffect(() => {
    queryPolls(client, addressProvider, filter, undefined, limit).then(
      ({ data }) => {
        if (data.polls?.polls) {
          setPolls(data.polls.polls);
        }
        setGovConfig(data.govConfig);
      },
    );
  }, [addressProvider, client, filter]);

  const loadMore = useCallback(() => {
    if (polls.length > 0) {
      queryPolls(
        client,
        addressProvider,
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
        setGovConfig(data.govConfig);
      });
    }
  }, [addressProvider, client, filter, polls]);

  return [polls, govConfig, loadMore];
}

export function queryPolls(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  filter?: PollStatus,
  start_after?: number,
  limit?: number,
) {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        Gov_contract: addressProvider.gov(),
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
