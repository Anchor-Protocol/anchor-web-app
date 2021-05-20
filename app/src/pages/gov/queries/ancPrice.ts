import type { uANC, uAncUstLP, UST, uUST } from '@anchor-protocol/types';
import { terraswap, uToken, WASMContractResult } from '@anchor-protocol/types';
import { gql, useQuery } from '@apollo/client';
import { useSubscription } from '@terra-dev/broadcastable-operation';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import big from 'big.js';
import { AncPrice } from 'pages/gov/models/ancPrice';
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

    const ANCPoolSize = (assets[0].amount as unknown) as uANC;
    const USTPoolSize = (assets[1].amount as unknown) as uUST;
    const LPShare = (total_share as unknown) as uAncUstLP;
    const ANCPrice = big(USTPoolSize)
      .div(+ANCPoolSize === 0 ? '1' : ANCPoolSize)
      .toString() as UST;

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
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 60 * 10,
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
