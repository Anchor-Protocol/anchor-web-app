import { Num, Ratio, uaUST } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useLastSyncedHeight } from 'queries/lastSyncedHeight';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  aUSTBalance: {
    Result: string;
  };
  exchangeRate: {
    Result: string;
  };
}

export interface Data {
  aUSTBalance: {
    Result: string;
    balance: uaUST<string>;
  };
  exchangeRate: {
    Result: string;
    a_token_supply: Num<string>;
    exchange_rate: Ratio<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  aUSTBalance: (existing, { aUSTBalance }) => {
    return parseResult(existing.aUSTBalance, aUSTBalance.Result);
  },
  exchangeRate: (existing, { exchangeRate }) => {
    return parseResult(existing.exchangeRate, exchangeRate.Result);
  },
});

export interface RawVariables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: string;
  moneyMarketContract: string;
  moneyMarketEpochQuery: string;
}

export interface Variables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: {
    balance: {
      address: string;
    };
  };
  moneyMarketContract: string;
  moneyMarketEpochQuery: {
    epoch_state: {
      lastSyncedHeight: number;
    };
  };
}

export function mapVariables({
  anchorTokenContract,
  anchorTokenBalanceQuery,
  moneyMarketContract,
  moneyMarketEpochQuery,
}: Variables): RawVariables {
  return {
    anchorTokenContract,
    anchorTokenBalanceQuery: JSON.stringify(anchorTokenBalanceQuery),
    moneyMarketContract,
    moneyMarketEpochQuery: JSON.stringify(moneyMarketEpochQuery),
  };
}

export const query = gql`
  query __totalDeposit(
    $anchorTokenContract: String!
    $anchorTokenBalanceQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenBalanceQuery
    ) {
      Result
    }

    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochQuery
    ) {
      Result
    }
  }
`;

export function useDeposit(): MappedQueryResult<RawVariables, RawData, Data> {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const { data: lastSyncedHeight } = useLastSyncedHeight();

  const variables = useMemo(() => {
    return mapVariables({
      anchorTokenContract: addressProvider.aToken(''),
      anchorTokenBalanceQuery: {
        balance: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
      moneyMarketContract: addressProvider.market(''),
      moneyMarketEpochQuery: {
        epoch_state: {
          lastSyncedHeight:
            typeof lastSyncedHeight === 'number' ? lastSyncedHeight : 0,
        },
      },
    });
  }, [addressProvider, lastSyncedHeight, status]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: status.status !== 'ready' || typeof lastSyncedHeight !== 'number',
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
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
