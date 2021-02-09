import { bLuna, Num } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, QueryResult, useQuery } from '@apollo/client';
import big from 'big.js';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';

export interface StringifiedData {
  terraswapPoolInfo: {
    Result: string;
  };
}

export interface Data {
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
}

export function parseData({ terraswapPoolInfo }: StringifiedData): Data {
  const data = JSON.parse(terraswapPoolInfo.Result) as Omit<Data, 'bLunaPrice'>;
  return {
    ...data,
    bLunaPrice: big(data.assets[0].amount)
      .div(data.assets[1].amount)
      .toFixed() as bLuna,
  };
}

export interface StringifiedVariables {
  bLunaTerraswap: string;
  poolInfoQuery: string;
}

export interface Variables {
  bLunaTerraswap: string;
}

export function stringifyVariables({
  bLunaTerraswap,
}: Variables): StringifiedVariables {
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

export function useTerraswapBLunaPrice(): QueryResult<
  StringifiedData,
  StringifiedVariables
> & {
  parsedData: Data | undefined;
} {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const variables = useMemo(() => {
    return stringifyVariables({
      bLunaTerraswap: addressProvider.blunaBurnPair(),
    });
  }, [addressProvider]);

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'network-only',
    variables,
  });

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
