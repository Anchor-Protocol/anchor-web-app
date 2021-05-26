import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import { useSubscription } from '@terra-dev/broadcastable-operation';
import { createMap, Mapped, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  rewardState: WASMContractResult;
  claimableReward: WASMContractResult;
}

export interface Data {
  rewardState: WASMContractResult<bluna.reward.StateResponse>;
  claimableReward: WASMContractResult<bluna.reward.HolderResponse>;
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
  rewardState: bluna.reward.State;
  claimableRewardQuery: bluna.reward.Holder;
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
  const { bluna } = useContractAddress();

  const userWallet = useConnectedWallet();

  const variables = useMemo(() => {
    if (!userWallet) return undefined;

    return mapVariables({
      bAssetRewardContract: bluna.reward,
      rewardState: {
        state: {},
      },
      claimableRewardQuery: {
        holder: {
          address: userWallet.walletAddress,
        },
      },
    });
  }, [bluna.reward, userWallet]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !variables || !userWallet,
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
    data: userWallet ? data : mockupData,
    refetch,
  };
}
