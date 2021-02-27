import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import type { Num, uUST } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { Int } from '@terra-money/terra.js';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  ancPrice: {
    Result: string;
  };
}

export interface Data {
  ancPrice: {
    Result: string;
    ANCPoolSize: Num<string>;
    USTPoolSize: Num<string>;
    LPShare: Num<string>;
    ANCPrice: uUST<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  ancPrice: (existing, { ancPrice }) => {
    if (existing.__data?.ancPrice.Result === ancPrice.Result) {
      return existing.ancPrice;
    }

    const { assets, total_share } = JSON.parse(ancPrice.Result) as {
      assets: [{ amount: Num<string> }, { amount: Num<string> }];
      total_share: Num<string>;
    };

    const ANCPoolSize = assets[0].amount as Num;
    const USTPoolSize = assets[0].amount as Num;
    const LPShare = total_share;
    const ANCPrice = new Int(USTPoolSize).div(ANCPoolSize).toString() as uUST;

    return {
      Result: ancPrice.Result,
      ANCPoolSize,
      USTPoolSize,
      LPShare,
      ANCPrice: ANCPrice.toLowerCase() === 'nan' ? ('0' as uUST) : ANCPrice,
    };
  },
});

export interface RawVariables {
  ANCTerraswap: string;
  poolInfoQuery: string;
}

export interface Variables {
  ANCTerraswap: string;
}

export function mapVariables({ ANCTerraswap }: Variables): RawVariables {
  return {
    ANCTerraswap,
    poolInfoQuery: JSON.stringify({
      pool: {},
    }),
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

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      ANCTerraswap: addressProvider.terraswapAncUstPair(),
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
