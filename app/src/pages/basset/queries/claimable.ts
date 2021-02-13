import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { Num, ubLuna } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
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
  const { status } = useWallet();

  const variables = useMemo(() => {
    return mapVariables({
      bAssetRewardContract: addressProvider.bAssetReward(''),
      rewardState: {
        state: {},
      },
      claimableRewardQuery: {
        holder: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
    });
  }, [addressProvider, status]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'network-only',
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
