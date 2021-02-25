import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { Num, ubLuna } from '@anchor-protocol/notation';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  rewardState: {
    Result: string;
  };

  claimableReward: {
    Result: string;
  };
}

export interface Data {
  rewardState: {
    Result: string;
    global_index: Num<string>;
    total_balance: ubLuna<string>;
  };

  claimableReward: {
    Result: string;
    address: string;
    balance: ubLuna<string>;
    index: Num<string>;
    pending_rewards: ubLuna<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  rewardState: (existing, { rewardState }) => {
    return parseResult(existing.rewardState, rewardState.Result);
  },
  claimableReward: (existing, { claimableReward }: RawData) => {
    return parseResult(existing.claimableReward, claimableReward.Result);
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    rewardState: {
      Result: '',
    },
    claimableReward: {
      Result: '',
    },
  },
  rewardState: undefined,
  claimableReward: undefined,
};

export interface RawVariables {
  bAssetRewardContract: string;
  rewardState: string;
  claimableRewardQuery: string;
}

export interface Variables {
  bAssetRewardContract: string;
  rewardState: {
    state: {};
  };
  claimableRewardQuery: {
    holder: {
      address: string;
    };
  };
}

export function mapVariables({
  bAssetRewardContract,
  rewardState,
  claimableRewardQuery,
}: Variables): RawVariables {
  return {
    bAssetRewardContract,
    rewardState: JSON.stringify(rewardState),
    claimableRewardQuery: JSON.stringify(claimableRewardQuery),
  };
}

export const query = gql`
  query __claimable(
    $bAssetRewardContract: String!
    $rewardState: String!
    $claimableRewardQuery: String!
  ) {
    rewardState: WasmContractsContractAddressStore(
      ContractAddress: $bAssetRewardContract
      QueryMsg: $rewardState
    ) {
      Result
    }

    claimableReward: WasmContractsContractAddressStore(
      ContractAddress: $bAssetRewardContract
      QueryMsg: $claimableRewardQuery
    ) {
      Result
    }
  }
`;

export function useClaimable(): MappedQueryResult<RawVariables, RawData, Data> {
  const addressProvider = useAddressProvider();

  const { serviceAvailable, walletReady } = useService();

  const variables = useMemo(() => {
    return mapVariables({
      bAssetRewardContract: addressProvider.bAssetReward(''),
      rewardState: {
        state: {},
      },
      claimableRewardQuery: {
        holder: {
          address: walletReady?.walletAddress ?? '',
        },
      },
    });
  }, [addressProvider, walletReady?.walletAddress]);

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
