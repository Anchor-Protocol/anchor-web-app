import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { uaUST, ubLuna, uLuna, uUST } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  bankBalances: {
    Result: { Denom: string; Amount: string }[];
  };

  ubLunaBalance: {
    Result: string;
  };

  uaUSTBalance: {
    Result: string;
  };
}

export interface Data {
  uUSD: uUST<string>;
  uLuna: uLuna<string>;
  ubLuna: ubLuna<string>;
  uaUST: uaUST<string>;
}

export const dataMap = createMap<RawData, Data>({
  uUSD: (_, { bankBalances }) => {
    return (bankBalances.Result.find(({ Denom }) => Denom === 'uusd')?.Amount ??
      '0') as uUST;
  },
  uLuna: (_, { bankBalances }) => {
    return (bankBalances.Result.find(({ Denom }) => Denom === 'uluna')
      ?.Amount ?? '0') as uLuna;
  },
  uaUST: (_, { uaUSTBalance }) => {
    return JSON.parse(uaUSTBalance.Result).balance as uaUST;
  },
  ubLuna: (_, { ubLunaBalance }) => {
    return JSON.parse(ubLunaBalance.Result).balance as ubLuna;
  },
});

export interface RawVariables {
  walletAddress: string;
  bAssetTokenAddress: string;
  bAssetTokenBalanceQuery: string;
  aTokenAddress: string;
  aTokenBalanceQuery: string;
}

export interface Variables {
  walletAddress: string;
  bAssetTokenAddress: string;
  aTokenAddress: string;
}

export function mapVariables({
  walletAddress,
  bAssetTokenAddress,
  aTokenAddress,
}: Variables): RawVariables {
  return {
    walletAddress,
    bAssetTokenAddress,
    bAssetTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    aTokenAddress,
    aTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
  };
}

export const query = gql`
  query __userBalances(
    $walletAddress: String!
    $bAssetTokenAddress: String!
    $bAssetTokenBalanceQuery: String!
    $aTokenAddress: String!
    $aTokenBalanceQuery: String!
  ) {
    # uluna, ukrt, uust...
    bankBalances: BankBalancesAddress(Address: $walletAddress) {
      Result {
        Denom
        Amount
      }
    }

    # ubluna
    ubLunaBalance: WasmContractsContractAddressStore(
      ContractAddress: $bAssetTokenAddress
      QueryMsg: $bAssetTokenBalanceQuery
    ) {
      Result
    }

    # uaust
    uaUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $aTokenAddress
      QueryMsg: $aTokenBalanceQuery
    ) {
      Result
    }
  }
`;

export function useUserBalances(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const variables = useMemo(() => {
    return mapVariables({
      walletAddress: status.status === 'ready' ? status.walletAddress : '',
      bAssetTokenAddress: addressProvider.bAssetToken('bluna'),
      aTokenAddress: addressProvider.aToken('usd'),
    });
  }, [addressProvider, status]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
