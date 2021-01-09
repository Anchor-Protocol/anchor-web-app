import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useCallback, useMemo, useState } from 'react';

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
    withdrawable: string;
  };
  withdrawRequests: {
    address: string;
    requests: [number, string][];
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
        ? Math.min(...parsedWithdrawRequests.requests.map(([index]) => index))
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
  updateWithdrawable: () => void;
} {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const [now, setNow] = useState(() => Date.now());

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
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
    }),
  });

  const updateWithdrawable = useCallback(() => {
    setNow(Date.now());
  }, []);

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
    updateWithdrawable,
  };
}
