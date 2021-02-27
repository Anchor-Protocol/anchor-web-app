import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import type { uaUST, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
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

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    bankBalances: {
      Result: [
        { Denom: 'uusd', Amount: '0' },
        { Denom: 'uluna', Amount: '0' },
      ],
    },
    uaUSTBalance: {
      Result: '',
    },
    ubLunaBalance: {
      Result: '',
    },
  },
  uUSD: '0' as uUST,
  uaUST: '0' as uaUST,
  uLuna: '0' as uLuna,
  ubLuna: '0' as ubLuna,
};

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
  const { cw20 } = useContractAddress();

  const { serviceAvailable, walletReady } = useService();

  const variables = useMemo(() => {
    return mapVariables({
      walletAddress: walletReady?.walletAddress ?? '',
      bAssetTokenAddress: cw20.bLuna,
      aTokenAddress: cw20.aUST,
    });
  }, [cw20.aUST, cw20.bLuna, walletReady?.walletAddress]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable,
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
    data: serviceAvailable ? data : mockupData,
    refetch,
  };
}
