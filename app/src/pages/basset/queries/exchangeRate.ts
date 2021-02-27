import type { DateTime, Rate, uLuna } from '@anchor-protocol/types';
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
  exchangeRate: {
    Result: string;
  };
}

export interface Data {
  exchangeRate: {
    Result: string;
    actual_unbonded_amount: uLuna<string>;
    exchange_rate: Rate<string>;
    last_index_modification: DateTime;
    last_processed_batch: number;
    last_unbonded_time: DateTime;
    prev_hub_balance: uLuna<string>;
    total_bond_amount: uLuna<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  exchangeRate: (existing, { exchangeRate }) => {
    return parseResult(existing.exchangeRate, exchangeRate.Result);
  },
});

export interface RawVariables {
  bLunaHubContract: string;
  stateQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  stateQuery?: {
    state: {};
  };
}

export function mapVariables({
  bLunaHubContract,
  stateQuery = { state: {} },
}: Variables): RawVariables {
  return {
    bLunaHubContract,
    stateQuery: JSON.stringify(stateQuery),
  };
}

export const query = gql`
  query __exchangeRate($bLunaHubContract: String!, $stateQuery: String!) {
    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $stateQuery
    ) {
      Result
    }
  }
`;

export function useExchangeRate({
  bAsset,
}: {
  bAsset: string;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const { online } = useService();

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: addressProvider.blunaHub(bAsset),
      stateQuery: {
        state: {},
      },
    });
  }, [addressProvider, bAsset]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !online,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
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
