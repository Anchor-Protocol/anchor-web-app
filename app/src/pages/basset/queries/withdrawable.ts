import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import type { ubLuna, uLuna } from '@anchor-protocol/types';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo, useState } from 'react';

export interface RawData {
  withdrawableAmount: {
    Result: string;
  };
  withdrawRequests: {
    Result: string;
  };
}

export interface Data {
  withdrawableAmount: {
    Result: string;
    withdrawable: uLuna<string>;
  };
  withdrawRequests: {
    Result: string;
    address: string;
    requests: [number, ubLuna<string>][];
    startFrom: number;
  };
}

export const dataMap = createMap<RawData, Data>({
  withdrawableAmount: (existing, { withdrawableAmount }) => {
    return existing.withdrawableAmount?.Result === withdrawableAmount.Result
      ? existing.withdrawableAmount
      : { ...withdrawableAmount, ...JSON.parse(withdrawableAmount.Result) };
  },
  withdrawRequests: (existing, { withdrawRequests }) => {
    if (existing.withdrawRequests?.Result === withdrawRequests.Result) {
      return existing.withdrawRequests;
    }

    const parsed = JSON.parse(
      withdrawRequests.Result,
    ) as Data['withdrawRequests'];

    return {
      ...withdrawRequests,
      ...parsed,
      startFrom:
        parsed.requests.length > 0
          ? Math.max(
              0,
              Math.min(...parsed.requests.map(([index]) => index)) - 1,
            )
          : -1,
    };
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    withdrawableAmount: {
      Result: '',
    },
    withdrawRequests: {
      Result: '',
    },
  },
  withdrawableAmount: undefined,
  withdrawRequests: undefined,
};

export interface RawVariables {
  bLunaHubContract: string;
  withdrawableAmountQuery: string;
  withdrawRequestsQuery: string;
  exchangeRateQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  withdrawableAmountQuery: {
    withdrawable_unbonded: {
      address: string;
      block_time: number;
    };
  };
  withdrawRequestsQuery: {
    unbond_requests: {
      address: string;
    };
  };
  exchangeRateQuery: {
    state: {};
  };
}

export function mapVariables({
  bLunaHubContract,
  withdrawableAmountQuery,
  withdrawRequestsQuery,
  exchangeRateQuery,
}: Variables): RawVariables {
  return {
    bLunaHubContract,
    withdrawableAmountQuery: JSON.stringify(withdrawableAmountQuery),
    withdrawRequestsQuery: JSON.stringify(withdrawRequestsQuery),
    exchangeRateQuery: JSON.stringify(exchangeRateQuery),
  };
}

export const query = gql`
  query __withdrawable(
    $bLunaHubContract: String!
    $withdrawableAmountQuery: String!
    $withdrawRequestsQuery: String!
  ) {
    withdrawableAmount: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $withdrawableAmountQuery
    ) {
      Result
    }

    withdrawRequests: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $withdrawRequestsQuery
    ) {
      Result
    }
  }
`;

export function useWithdrawable({
  bAsset,
}: {
  bAsset: string;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const { bluna } = useContractAddress();

  const { serviceAvailable, walletReady } = useService();

  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: bluna.hub,
      withdrawableAmountQuery: {
        withdrawable_unbonded: {
          block_time: now,
          address: walletReady?.walletAddress ?? '',
        },
      },
      withdrawRequestsQuery: {
        unbond_requests: {
          address: walletReady?.walletAddress ?? '',
        },
      },
      exchangeRateQuery: {
        state: {},
      },
    });
  }, [bluna.hub, now, walletReady?.walletAddress]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
    onError,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      setNow(Math.floor(Date.now() / 1000));
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
