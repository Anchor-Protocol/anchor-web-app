import {
  anchorToken,
  ContractAddress,
  HumanAddr,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, map } from '@terra-dev/use-map';
import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { useCallback, useEffect, useState } from 'react';

export interface RawData {
  voters: WASMContractResult;
}

export interface Data {
  voters: WASMContractResult<anchorToken.gov.VotersResponse>;
}

export const dataMap = createMap<RawData, Data>({
  voters: (existing, { voters }) => {
    return parseResult(existing.voters, voters.Result);
  },
});

export interface RawVariables {
  govAddress: string;
  votersQuery: string;
}

export interface Variables {
  govAddress: HumanAddr;
  votersQuery: anchorToken.gov.Voters;
}

export function mapVariables({
  govAddress,
  votersQuery,
}: Variables): RawVariables {
  return {
    govAddress,
    votersQuery: JSON.stringify(votersQuery),
  };
}

export const query = gql`
  query __voters($govAddress: String!, $votersQuery: String!) {
    voters: WasmContractsContractAddressStore(
      ContractAddress: $govAddress
      QueryMsg: $votersQuery
    ) {
      Result
    }
  }
`;

const limit = 10;

export function useVoters(
  pollId: number,
): [voters: anchorToken.gov.Voter[], isLast: boolean, loadMore: () => void] {
  const client = useApolloClient();

  const address = useContractAddress();

  const [voters, setVoters] = useState<anchorToken.gov.Voter[]>([]);

  const [isLast, setIsLast] = useState<boolean>(false);

  useEffect(() => {
    // initialize data
    setIsLast(false);
    setVoters([]);

    queryVoters(client, address, pollId, undefined, limit).then(({ data }) => {
      if (data.voters?.voters) {
        if (data.voters.voters.length > 0) {
          setVoters(data.voters.voters);
        }

        if (data.voters.voters.length < limit) {
          setIsLast(true);
        }
      }
    });
  }, [address, client, pollId]);

  const loadMore = useCallback(() => {
    if (voters.length > 0) {
      queryVoters(
        client,
        address,
        pollId,
        voters[voters.length - 1].voter,
        limit,
      ).then(({ data }) => {
        if (data.voters) {
          setVoters((prev) => {
            if (
              data.voters &&
              Array.isArray(data.voters.voters) &&
              data.voters.voters.length > 0
            ) {
              return [...prev, ...data.voters.voters];
            }
            return prev;
          });

          if (data.voters?.voters.length < limit) {
            setIsLast(true);
          }
        }
      });
    }
  }, [address, client, pollId, voters]);

  return [voters, isLast, loadMore];
}

export function queryVoters(
  client: ApolloClient<any>,
  address: ContractAddress,
  poll_id: number,
  start_after?: HumanAddr,
  limit?: number,
) {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        govAddress: address.anchorToken.gov,
        votersQuery: {
          voters: {
            poll_id,
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
