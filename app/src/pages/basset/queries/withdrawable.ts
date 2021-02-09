import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { ubLuna, uLuna } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo, useState } from 'react';

export interface StringifiedData {
  withdrawableAmount: {
    Result: string;
  };
  withdrawRequests: {
    Result: string;
  };
}

export interface Data {
  withdrawableAmount: {
    withdrawable: uLuna<string>;
  };
  withdrawRequests: {
    address: string;
    requests: [number, ubLuna<string>][];
  };
  withdrawRequestsStartFrom: number;
}

export function parseData({
  withdrawableAmount,
  withdrawRequests,
}: StringifiedData): Data {
  const parsedWithdrawRequests: Data['withdrawRequests'] = JSON.parse(
    withdrawRequests.Result,
  );
  return {
    withdrawableAmount: JSON.parse(withdrawableAmount.Result),
    withdrawRequests: parsedWithdrawRequests,
    withdrawRequestsStartFrom:
      parsedWithdrawRequests.requests.length > 0
        ? Math.max(
            0,
            Math.min(
              ...parsedWithdrawRequests.requests.map(([index]) => index),
            ) - 1,
          )
        : -1,
  };
}

export interface StringifiedVariables {
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

export function stringifyVariables({
  bLunaHubContract,
  withdrawableAmountQuery,
  withdrawRequestsQuery,
  exchangeRateQuery,
}: Variables): StringifiedVariables {
  return {
    bLunaHubContract,
    withdrawableAmountQuery: JSON.stringify(withdrawableAmountQuery),
    withdrawRequestsQuery: JSON.stringify(withdrawRequestsQuery),
    exchangeRateQuery: JSON.stringify(exchangeRateQuery),
  };
}

export const query = gql`
  query bLunaClaim(
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
}): QueryResult<StringifiedData, StringifiedVariables> & {
  parsedData: Data | undefined;
} {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  const variables = useMemo(() => {
    return stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(bAsset),
      withdrawableAmountQuery: {
        withdrawable_unbonded: {
          block_time: now,
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
      withdrawRequestsQuery: {
        unbond_requests: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
      exchangeRateQuery: {
        state: {},
      },
    });
  }, [addressProvider, bAsset, now, status]);

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'network-only',
    variables,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      setNow(Math.floor(Date.now() / 1000));
    }
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
