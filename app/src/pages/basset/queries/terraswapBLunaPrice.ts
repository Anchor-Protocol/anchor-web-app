import { bLuna, Num } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import big from 'big.js';
import { useAddressProvider } from 'contexts/contract';
import { MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  terraswapPoolInfo: {
    Result: string;
  };
}

export interface Data {
  terraswapPoolInfo: {
    Result: string;
    total_share: string;
    assets: [
      {
        amount: Num<string>;
        info: {
          token: {
            contract_addr: string;
          };
        };
      },
      {
        amount: Num<string>;
        info: {
          native_token: {
            denom: string;
          };
        };
      },
    ];
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
  bLunaTerraswap: string;
}

export function mapVariables({ bLunaTerraswap }: Variables): RawVariables {
  return {
    bLunaTerraswap,
    poolInfoQuery: JSON.stringify({
      pool: {},
    }),
  };
}

export const query = gql`
  query terraswapPoolInfo($bLunaTerraswap: String!, $poolInfoQuery: String!) {
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
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaTerraswap: addressProvider.blunaBurnPair(),
    });
  }, [addressProvider]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'network-only',
    variables,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
