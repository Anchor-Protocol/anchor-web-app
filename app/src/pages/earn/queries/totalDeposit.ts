import { useEventBusListener } from '@anchor-protocol/event-bus';
import type { Num, Rate, uaUST } from '@anchor-protocol/types';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { useLastSyncedHeight } from 'queries/lastSyncedHeight';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
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
    exchange_rate: Rate<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  aUSTBalance: (existing, { aUSTBalance }) => {
    return aUSTBalance
      ? parseResult(existing.aUSTBalance, aUSTBalance.Result)
      : existing.aUSTBalance;
  },
  exchangeRate: (existing, { exchangeRate }) => {
    return exchangeRate
      ? parseResult(existing.exchangeRate, exchangeRate.Result)
      : existing.exchangeRate;
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    aUSTBalance: {
      Result: '',
    },
    exchangeRate: {
      Result: '',
    },
  },
  aUSTBalance: {
    Result: '',
    balance: '0' as uaUST,
  },
  exchangeRate: {
    Result: '',
    exchange_rate: '1' as Rate,
    a_token_supply: '0' as Num,
  },
};

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
  const { moneyMarket, cw20 } = useContractAddress();
  const { serviceAvailable, walletReady } = useService();

  const { data: lastSyncedHeight } = useLastSyncedHeight();

  const variables = useMemo(() => {
    return mapVariables({
      anchorTokenContract: cw20.aUST,
      anchorTokenBalanceQuery: {
        balance: {
          address: walletReady?.walletAddress ?? '',
        },
      },
      moneyMarketContract: moneyMarket.market,
      moneyMarketEpochQuery: {
        epoch_state: {
          lastSyncedHeight:
            typeof lastSyncedHeight === 'number' ? lastSyncedHeight : 0,
        },
      },
    });
  }, [
    cw20.aUST,
    lastSyncedHeight,
    moneyMarket.market,
    walletReady?.walletAddress,
  ]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable || typeof lastSyncedHeight !== 'number',
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
    onError,
  });

  useEventBusListener('interest-earned-updated', () => {
    if (serviceAvailable) {
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
