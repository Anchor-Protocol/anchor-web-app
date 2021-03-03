import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import type { Num, UST } from '@anchor-protocol/types';
import { terraswap, uToken, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import big from 'big.js';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  ancPrice: WASMContractResult;
}

export interface Data {
  ancPrice: WASMContractResult<AncPrice>;
}

export const dataMap = createMap<RawData, Data>({
  ancPrice: (existing, { ancPrice }) => {
    if (existing.__data?.ancPrice.Result === ancPrice.Result) {
      return existing.ancPrice;
    }

    const {
      assets,
      total_share,
    }: WASMContractResult<terraswap.PoolResponse<uToken>> = JSON.parse(
      ancPrice.Result,
    );

    console.log('ancPrice.ts..ancPrice()', { total_share });

    const ANCPoolSize = (assets[0].amount as unknown) as Num;
    const USTPoolSize = (assets[1].amount as unknown) as Num;
    const LPShare = (total_share as unknown) as Num;
    const ANCPrice = big(USTPoolSize).div(ANCPoolSize).toString() as UST;

    return {
      Result: ancPrice.Result,
      ANCPoolSize,
      USTPoolSize,
      LPShare,
      ANCPrice: ANCPrice.toLowerCase() === 'nan' ? ('0' as UST) : ANCPrice,
    };
  },
});

export interface RawVariables {
  ANCTerraswap: string;
  poolInfoQuery: string;
}

export interface Variables {
  ANCTerraswap: string;
  poolInfoQuery: terraswap.Pool;
}

export function mapVariables({
  ANCTerraswap,
  poolInfoQuery,
}: Variables): RawVariables {
  return {
    ANCTerraswap,
    poolInfoQuery: JSON.stringify(poolInfoQuery),
  };
}

export const query = gql`
  query __ancPrice($ANCTerraswap: String!, $poolInfoQuery: String!) {
    ancPrice: WasmContractsContractAddressStore(
      ContractAddress: $ANCTerraswap
      QueryMsg: $poolInfoQuery
    ) {
      Result
    }
  }
`;

export function useANCPrice(): MappedQueryResult<RawVariables, RawData, Data> {
  const { serviceAvailable } = useService();

  const { terraswap } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      ANCTerraswap: terraswap.ancUstPair,
      poolInfoQuery: {
        pool: {},
      },
    });
  }, [terraswap.ancUstPair]);

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
    pollInterval: 1000 * 60,
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  return {
    ...result,
    data,
    refetch,
  };
}
