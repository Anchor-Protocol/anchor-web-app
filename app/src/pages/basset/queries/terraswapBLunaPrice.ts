import type { bLuna, HumanAddr } from '@anchor-protocol/types';
import { terraswap, uToken, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import big from 'big.js';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  terraswapPoolInfo: WASMContractResult;
}

export interface Data {
  terraswapPoolInfo: WASMContractResult<terraswap.PoolResponse<uToken>> & {
    bLunaPrice: bLuna;
  };
}

export const dataMap = createMap<RawData, Data>({
  terraswapPoolInfo: (existing, { terraswapPoolInfo }) => {
    if (
      existing.terraswapPoolInfo &&
      existing.terraswapPoolInfo.Result === terraswapPoolInfo.Result
    ) {
      return existing.terraswapPoolInfo;
    }

    const data = JSON.parse(terraswapPoolInfo.Result) as Omit<
      Data['terraswapPoolInfo'],
      'bLunaPrice'
    >;
    return {
      ...data,
      bLunaPrice: big(data.assets[0].amount)
        .div(data.assets[1].amount)
        .toFixed() as bLuna,
    };
  },
});

export interface RawVariables {
  bLunaTerraswap: string;
  poolInfoQuery: string;
}

export interface Variables {
  bLunaTerraswap: HumanAddr;
  poolInfoQuery: terraswap.Pool;
}

export function mapVariables({
  bLunaTerraswap,
  poolInfoQuery,
}: Variables): RawVariables {
  return {
    bLunaTerraswap,
    poolInfoQuery: JSON.stringify(poolInfoQuery),
  };
}

export const query = gql`
  query __terraswapBLunaPrice(
    $bLunaTerraswap: String!
    $poolInfoQuery: String!
  ) {
    terraswapPoolInfo: WasmContractsContractAddressStore(
      ContractAddress: $bLunaTerraswap
      QueryMsg: $poolInfoQuery
    ) {
      Result
    }
  }
`;

export function useTerraswapBLunaPrice(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { terraswap } = useContractAddress();

  const { online } = useService();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaTerraswap: terraswap.blunaLunaPair,
      poolInfoQuery: {
        pool: {},
      },
    });
  }, [terraswap.blunaLunaPair]);

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
