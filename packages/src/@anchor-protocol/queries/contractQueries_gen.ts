// THIS FILE WAS AUTO GENERATED
// DO NOT EDIT MANUALLY
// YOU CAN SEE THE GENERATOR SCRIPTS ON PACKAGE.JSON

/* eslint-disable */

import {
  anchorToken,
  bluna,
  liquidation,
  moneyMarket,
} from '@anchor-protocol/types';
import { ApolloError } from '@apollo/client';
import { Omit } from '@material-ui/core';
import {
  useWasmQuery,
  UseWasmQueryOptions,
  wasmQuery,
  WasmQueryOptions,
} from './wasmQuery';
import { useQueryDependency, QueryDependency } from './provider';

export function useAnchorTokenCollectorConfig(
  options: Omit<
    UseWasmQueryOptions<anchorToken.collector.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    anchorToken.collector.Config,
    anchorToken.collector.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_collector_Config',
    address: address.anchorToken.collector,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenCollectorConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<anchorToken.collector.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    anchorToken.collector.Config,
    anchorToken.collector.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_collector_Config',
    address: address.anchorToken.collector,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenCommunityConfig(
  options: Omit<
    UseWasmQueryOptions<anchorToken.community.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    anchorToken.community.Config,
    anchorToken.community.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_community_Config',
    address: address.anchorToken.community,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenCommunityConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<anchorToken.community.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    anchorToken.community.Config,
    anchorToken.community.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_community_Config',
    address: address.anchorToken.community,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenDistributorConfig(
  options: Omit<
    UseWasmQueryOptions<anchorToken.distributor.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    anchorToken.distributor.Config,
    anchorToken.distributor.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_distributor_Config',
    address: address.anchorToken.distributor,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenDistributorConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<anchorToken.distributor.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    anchorToken.distributor.Config,
    anchorToken.distributor.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_distributor_Config',
    address: address.anchorToken.distributor,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenGovConfig(
  options: Omit<UseWasmQueryOptions<anchorToken.gov.Config>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>({
    ...options,
    id: 'anchorToken_gov_Config',
    address: address.anchorToken.gov,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenGovConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.gov.Config>, 'id' | 'address'>,
) => {
  return wasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Config',
      address: address.anchorToken.gov,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenGovPoll(
  options: Omit<UseWasmQueryOptions<anchorToken.gov.Poll>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<anchorToken.gov.Poll, anchorToken.gov.PollResponse>({
    ...options,
    id: 'anchorToken_gov_Poll',
    address: address.anchorToken.gov,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenGovPoll = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.gov.Poll>, 'id' | 'address'>,
) => {
  return wasmQuery<anchorToken.gov.Poll, anchorToken.gov.PollResponse>(client, {
    ...options,
    id: 'anchorToken_gov_Poll',
    address: address.anchorToken.gov,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenGovPolls(
  options: Omit<UseWasmQueryOptions<anchorToken.gov.Polls>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>({
    ...options,
    id: 'anchorToken_gov_Polls',
    address: address.anchorToken.gov,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenGovPolls = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.gov.Polls>, 'id' | 'address'>,
) => {
  return wasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Polls',
      address: address.anchorToken.gov,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenGovStaker(
  options: Omit<UseWasmQueryOptions<anchorToken.gov.Staker>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<anchorToken.gov.Staker, anchorToken.gov.StakerResponse>({
    ...options,
    id: 'anchorToken_gov_Staker',
    address: address.anchorToken.gov,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenGovStaker = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.gov.Staker>, 'id' | 'address'>,
) => {
  return wasmQuery<anchorToken.gov.Staker, anchorToken.gov.StakerResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Staker',
      address: address.anchorToken.gov,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenGovState(
  options: Omit<UseWasmQueryOptions<anchorToken.gov.State>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<anchorToken.gov.State, anchorToken.gov.StateResponse>({
    ...options,
    id: 'anchorToken_gov_State',
    address: address.anchorToken.gov,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenGovState = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.gov.State>, 'id' | 'address'>,
) => {
  return wasmQuery<anchorToken.gov.State, anchorToken.gov.StateResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_State',
      address: address.anchorToken.gov,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenGovVoters(
  options: Omit<UseWasmQueryOptions<anchorToken.gov.Voters>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<anchorToken.gov.Voters, anchorToken.gov.VotersResponse>({
    ...options,
    id: 'anchorToken_gov_Voters',
    address: address.anchorToken.gov,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenGovVoters = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.gov.Voters>, 'id' | 'address'>,
) => {
  return wasmQuery<anchorToken.gov.Voters, anchorToken.gov.VotersResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Voters',
      address: address.anchorToken.gov,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenStakingConfig(
  options: Omit<
    UseWasmQueryOptions<anchorToken.staking.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    anchorToken.staking.Config,
    anchorToken.staking.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_staking_Config',
    address: address.anchorToken.staking,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenStakingConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.staking.Config>, 'id' | 'address'>,
) => {
  return wasmQuery<
    anchorToken.staking.Config,
    anchorToken.staking.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_staking_Config',
    address: address.anchorToken.staking,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenStakingStakerInfo(
  options: Omit<
    UseWasmQueryOptions<anchorToken.staking.StakerInfo>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >({
    ...options,
    id: 'anchorToken_staking_StakerInfo',
    address: address.anchorToken.staking,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenStakingStakerInfo = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<anchorToken.staking.StakerInfo>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >(client, {
    ...options,
    id: 'anchorToken_staking_StakerInfo',
    address: address.anchorToken.staking,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useAnchorTokenStakingState(
  options: Omit<
    UseWasmQueryOptions<anchorToken.staking.State>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    anchorToken.staking.State,
    anchorToken.staking.StateResponse
  >({
    ...options,
    id: 'anchorToken_staking_State',
    address: address.anchorToken.staking,
    onError: options.onError ?? onError,
  });
}

export const queryAnchorTokenStakingState = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<anchorToken.staking.State>, 'id' | 'address'>,
) => {
  return wasmQuery<
    anchorToken.staking.State,
    anchorToken.staking.StateResponse
  >(client, {
    ...options,
    id: 'anchorToken_staking_State',
    address: address.anchorToken.staking,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaAirdropRegistryAirdropInfo(
  options: Omit<
    UseWasmQueryOptions<bluna.airdropRegistry.AirdropInfo>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    bluna.airdropRegistry.AirdropInfo,
    bluna.airdropRegistry.AirdropInfoResponse
  >({
    ...options,
    id: 'bluna_airdropRegistry_AirdropInfo',
    address: address.bluna.airdropRegistry,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaAirdropRegistryAirdropInfo = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<bluna.airdropRegistry.AirdropInfo>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    bluna.airdropRegistry.AirdropInfo,
    bluna.airdropRegistry.AirdropInfoResponse
  >(client, {
    ...options,
    id: 'bluna_airdropRegistry_AirdropInfo',
    address: address.bluna.airdropRegistry,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaAirdropRegistryConfig(
  options: Omit<
    UseWasmQueryOptions<bluna.airdropRegistry.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    bluna.airdropRegistry.Config,
    bluna.airdropRegistry.ConfigResponse
  >({
    ...options,
    id: 'bluna_airdropRegistry_Config',
    address: address.bluna.airdropRegistry,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaAirdropRegistryConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<bluna.airdropRegistry.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    bluna.airdropRegistry.Config,
    bluna.airdropRegistry.ConfigResponse
  >(client, {
    ...options,
    id: 'bluna_airdropRegistry_Config',
    address: address.bluna.airdropRegistry,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubAllHistory(
  options: Omit<UseWasmQueryOptions<bluna.hub.AllHistory>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.hub.AllHistory, bluna.hub.AllHistoryResponse>({
    ...options,
    id: 'bluna_hub_AllHistory',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubAllHistory = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.hub.AllHistory>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.hub.AllHistory, bluna.hub.AllHistoryResponse>(client, {
    ...options,
    id: 'bluna_hub_AllHistory',
    address: address.bluna.hub,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubConfig(
  options: Omit<UseWasmQueryOptions<bluna.hub.Config>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.hub.Config, bluna.hub.ConfigResponse>({
    ...options,
    id: 'bluna_hub_Config',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.hub.Config>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.hub.Config, bluna.hub.ConfigResponse>(client, {
    ...options,
    id: 'bluna_hub_Config',
    address: address.bluna.hub,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubCurrentBatch(
  options: Omit<UseWasmQueryOptions<bluna.hub.CurrentBatch>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.hub.CurrentBatch, bluna.hub.CurrentBatchResponse>({
    ...options,
    id: 'bluna_hub_CurrentBatch',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubCurrentBatch = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.hub.CurrentBatch>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.hub.CurrentBatch, bluna.hub.CurrentBatchResponse>(
    client,
    {
      ...options,
      id: 'bluna_hub_CurrentBatch',
      address: address.bluna.hub,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubParameters(
  options: Omit<UseWasmQueryOptions<bluna.hub.Parameters>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>({
    ...options,
    id: 'bluna_hub_Parameters',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubParameters = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.hub.Parameters>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>(client, {
    ...options,
    id: 'bluna_hub_Parameters',
    address: address.bluna.hub,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubState(
  options: Omit<UseWasmQueryOptions<bluna.hub.State>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.hub.State, bluna.hub.StateResponse>({
    ...options,
    id: 'bluna_hub_State',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubState = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.hub.State>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.hub.State, bluna.hub.StateResponse>(client, {
    ...options,
    id: 'bluna_hub_State',
    address: address.bluna.hub,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubUnbondRequests(
  options: Omit<
    UseWasmQueryOptions<bluna.hub.UnbondRequests>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    bluna.hub.UnbondRequests,
    bluna.hub.UnbondRequestsResponse
  >({
    ...options,
    id: 'bluna_hub_UnbondRequests',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubUnbondRequests = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.hub.UnbondRequests>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.hub.UnbondRequests, bluna.hub.UnbondRequestsResponse>(
    client,
    {
      ...options,
      id: 'bluna_hub_UnbondRequests',
      address: address.bluna.hub,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubWhitelistedValidators(
  options: Omit<
    UseWasmQueryOptions<bluna.hub.WhitelistedValidators>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    bluna.hub.WhitelistedValidators,
    bluna.hub.WhitelistedValidatorsResponse
  >({
    ...options,
    id: 'bluna_hub_WhitelistedValidators',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubWhitelistedValidators = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<bluna.hub.WhitelistedValidators>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    bluna.hub.WhitelistedValidators,
    bluna.hub.WhitelistedValidatorsResponse
  >(client, {
    ...options,
    id: 'bluna_hub_WhitelistedValidators',
    address: address.bluna.hub,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaHubWithdrawableUnbonded(
  options: Omit<
    UseWasmQueryOptions<bluna.hub.WithdrawableUnbonded>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    bluna.hub.WithdrawableUnbonded,
    bluna.hub.WithdrawableUnbondedResponse
  >({
    ...options,
    id: 'bluna_hub_WithdrawableUnbonded',
    address: address.bluna.hub,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaHubWithdrawableUnbonded = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<bluna.hub.WithdrawableUnbonded>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    bluna.hub.WithdrawableUnbonded,
    bluna.hub.WithdrawableUnbondedResponse
  >(client, {
    ...options,
    id: 'bluna_hub_WithdrawableUnbonded',
    address: address.bluna.hub,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaRewardAccruedRewards(
  options: Omit<
    UseWasmQueryOptions<bluna.reward.AccruedRewards>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    bluna.reward.AccruedRewards,
    bluna.reward.AccruedRewardsResponse
  >({
    ...options,
    id: 'bluna_reward_AccruedRewards',
    address: address.bluna.reward,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaRewardAccruedRewards = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<bluna.reward.AccruedRewards>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    bluna.reward.AccruedRewards,
    bluna.reward.AccruedRewardsResponse
  >(client, {
    ...options,
    id: 'bluna_reward_AccruedRewards',
    address: address.bluna.reward,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaRewardConfig(
  options: Omit<UseWasmQueryOptions<bluna.reward.Config>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.reward.Config, bluna.reward.ConfigResponse>({
    ...options,
    id: 'bluna_reward_Config',
    address: address.bluna.reward,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaRewardConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.reward.Config>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.reward.Config, bluna.reward.ConfigResponse>(client, {
    ...options,
    id: 'bluna_reward_Config',
    address: address.bluna.reward,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaRewardHolder(
  options: Omit<UseWasmQueryOptions<bluna.reward.Holder>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.reward.Holder, bluna.reward.HolderResponse>({
    ...options,
    id: 'bluna_reward_Holder',
    address: address.bluna.reward,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaRewardHolder = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.reward.Holder>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.reward.Holder, bluna.reward.HolderResponse>(client, {
    ...options,
    id: 'bluna_reward_Holder',
    address: address.bluna.reward,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaRewardHolders(
  options: Omit<UseWasmQueryOptions<bluna.reward.Holders>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.reward.Holders, bluna.reward.HoldersResponse>({
    ...options,
    id: 'bluna_reward_Holders',
    address: address.bluna.reward,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaRewardHolders = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.reward.Holders>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.reward.Holders, bluna.reward.HoldersResponse>(client, {
    ...options,
    id: 'bluna_reward_Holders',
    address: address.bluna.reward,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useBlunaRewardState(
  options: Omit<UseWasmQueryOptions<bluna.reward.State>, 'id' | 'address'>,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<bluna.reward.State, bluna.reward.StateResponse>({
    ...options,
    id: 'bluna_reward_State',
    address: address.bluna.reward,
    onError: options.onError ?? onError,
  });
}

export const queryBlunaRewardState = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<bluna.reward.State>, 'id' | 'address'>,
) => {
  return wasmQuery<bluna.reward.State, bluna.reward.StateResponse>(client, {
    ...options,
    id: 'bluna_reward_State',
    address: address.bluna.reward,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useLiquidationLiquidationContractBid(
  options: Omit<
    UseWasmQueryOptions<liquidation.liquidationContract.Bid>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    liquidation.liquidationContract.Bid,
    liquidation.liquidationContract.BidResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_Bid',
    address: address.liquidation.liquidationContract,
    onError: options.onError ?? onError,
  });
}

export const queryLiquidationLiquidationContractBid = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<liquidation.liquidationContract.Bid>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    liquidation.liquidationContract.Bid,
    liquidation.liquidationContract.BidResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_Bid',
    address: address.liquidation.liquidationContract,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useLiquidationLiquidationContractBidsByCollateral(
  options: Omit<
    UseWasmQueryOptions<liquidation.liquidationContract.BidsByCollateral>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    liquidation.liquidationContract.BidsByCollateral,
    liquidation.liquidationContract.BidsByCollateralResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_BidsByCollateral',
    address: address.liquidation.liquidationContract,
    onError: options.onError ?? onError,
  });
}

export const queryLiquidationLiquidationContractBidsByCollateral = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<liquidation.liquidationContract.BidsByCollateral>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    liquidation.liquidationContract.BidsByCollateral,
    liquidation.liquidationContract.BidsByCollateralResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_BidsByCollateral',
    address: address.liquidation.liquidationContract,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useLiquidationLiquidationContractBidsByUser(
  options: Omit<
    UseWasmQueryOptions<liquidation.liquidationContract.BidsByUser>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    liquidation.liquidationContract.BidsByUser,
    liquidation.liquidationContract.BidsByUserResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_BidsByUser',
    address: address.liquidation.liquidationContract,
    onError: options.onError ?? onError,
  });
}

export const queryLiquidationLiquidationContractBidsByUser = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<liquidation.liquidationContract.BidsByUser>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    liquidation.liquidationContract.BidsByUser,
    liquidation.liquidationContract.BidsByUserResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_BidsByUser',
    address: address.liquidation.liquidationContract,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useLiquidationLiquidationContractConfig(
  options: Omit<
    UseWasmQueryOptions<liquidation.liquidationContract.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    liquidation.liquidationContract.Config,
    liquidation.liquidationContract.ConfigResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_Config',
    address: address.liquidation.liquidationContract,
    onError: options.onError ?? onError,
  });
}

export const queryLiquidationLiquidationContractConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<liquidation.liquidationContract.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    liquidation.liquidationContract.Config,
    liquidation.liquidationContract.ConfigResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_Config',
    address: address.liquidation.liquidationContract,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useLiquidationLiquidationContractLiquidationAmount(
  options: Omit<
    UseWasmQueryOptions<liquidation.liquidationContract.LiquidationAmount>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    liquidation.liquidationContract.LiquidationAmount,
    liquidation.liquidationContract.LiquidationAmountResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_LiquidationAmount',
    address: address.liquidation.liquidationContract,
    onError: options.onError ?? onError,
  });
}

export const queryLiquidationLiquidationContractLiquidationAmount = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<liquidation.liquidationContract.LiquidationAmount>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    liquidation.liquidationContract.LiquidationAmount,
    liquidation.liquidationContract.LiquidationAmountResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_LiquidationAmount',
    address: address.liquidation.liquidationContract,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketCustodyBorrower(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.custody.Borrower>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.custody.Borrower,
    moneyMarket.custody.BorrowerResponse
  >({
    ...options,
    id: 'moneyMarket_custody_Borrower',
    address: address.moneyMarket.custody,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketCustodyBorrower = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.custody.Borrower>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.custody.Borrower,
    moneyMarket.custody.BorrowerResponse
  >(client, {
    ...options,
    id: 'moneyMarket_custody_Borrower',
    address: address.moneyMarket.custody,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketCustodyBorrowers(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.custody.Borrowers>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.custody.Borrowers,
    moneyMarket.custody.BorrowersResponse
  >({
    ...options,
    id: 'moneyMarket_custody_Borrowers',
    address: address.moneyMarket.custody,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketCustodyBorrowers = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.custody.Borrowers>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.custody.Borrowers,
    moneyMarket.custody.BorrowersResponse
  >(client, {
    ...options,
    id: 'moneyMarket_custody_Borrowers',
    address: address.moneyMarket.custody,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketCustodyConfig(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.custody.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.custody.Config,
    moneyMarket.custody.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_custody_Config',
    address: address.moneyMarket.custody,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketCustodyConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<moneyMarket.custody.Config>, 'id' | 'address'>,
) => {
  return wasmQuery<
    moneyMarket.custody.Config,
    moneyMarket.custody.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_custody_Config',
    address: address.moneyMarket.custody,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketDistributionModelAncEmissionRate(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.distributionModel.AncEmissionRate>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.distributionModel.AncEmissionRate,
    moneyMarket.distributionModel.AncEmissionRateResponse
  >({
    ...options,
    id: 'moneyMarket_distributionModel_AncEmissionRate',
    address: address.moneyMarket.distributionModel,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketDistributionModelAncEmissionRate = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.distributionModel.AncEmissionRate>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.distributionModel.AncEmissionRate,
    moneyMarket.distributionModel.AncEmissionRateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_distributionModel_AncEmissionRate',
    address: address.moneyMarket.distributionModel,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketDistributionModelConfig(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.distributionModel.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.distributionModel.Config,
    moneyMarket.distributionModel.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_distributionModel_Config',
    address: address.moneyMarket.distributionModel,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketDistributionModelConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.distributionModel.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.distributionModel.Config,
    moneyMarket.distributionModel.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_distributionModel_Config',
    address: address.moneyMarket.distributionModel,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketInterestModelBorrowRate(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.interestModel.BorrowRate>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.interestModel.BorrowRate,
    moneyMarket.interestModel.BorrowRateResponse
  >({
    ...options,
    id: 'moneyMarket_interestModel_BorrowRate',
    address: address.moneyMarket.interestModel,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketInterestModelBorrowRate = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.interestModel.BorrowRate>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.interestModel.BorrowRate,
    moneyMarket.interestModel.BorrowRateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_interestModel_BorrowRate',
    address: address.moneyMarket.interestModel,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketInterestModelConfig(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.interestModel.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.interestModel.Config,
    moneyMarket.interestModel.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_interestModel_Config',
    address: address.moneyMarket.interestModel,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketInterestModelConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.interestModel.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.interestModel.Config,
    moneyMarket.interestModel.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_interestModel_Config',
    address: address.moneyMarket.interestModel,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketMarketBorrowInfo(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.market.BorrowerInfo>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >({
    ...options,
    id: 'moneyMarket_market_BorrowInfo',
    address: address.moneyMarket.market,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketMarketBorrowInfo = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.market.BorrowerInfo>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_BorrowInfo',
    address: address.moneyMarket.market,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketMarketBorrowInfos(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.market.BorrowerInfos>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.market.BorrowerInfos,
    moneyMarket.market.BorrowerInfosResponse
  >({
    ...options,
    id: 'moneyMarket_market_BorrowInfos',
    address: address.moneyMarket.market,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketMarketBorrowInfos = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.market.BorrowerInfos>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.market.BorrowerInfos,
    moneyMarket.market.BorrowerInfosResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_BorrowInfos',
    address: address.moneyMarket.market,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketMarketConfig(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.market.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.market.Config,
    moneyMarket.market.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_market_Config',
    address: address.moneyMarket.market,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketMarketConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<moneyMarket.market.Config>, 'id' | 'address'>,
) => {
  return wasmQuery<
    moneyMarket.market.Config,
    moneyMarket.market.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_Config',
    address: address.moneyMarket.market,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketMarketEpochState(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.market.EpochState>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.market.EpochState,
    moneyMarket.market.EpochStateResponse
  >({
    ...options,
    id: 'moneyMarket_market_EpochState',
    address: address.moneyMarket.market,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketMarketEpochState = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.market.EpochState>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.market.EpochState,
    moneyMarket.market.EpochStateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_EpochState',
    address: address.moneyMarket.market,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketMarketState(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.market.State>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >({
    ...options,
    id: 'moneyMarket_market_State',
    address: address.moneyMarket.market,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketMarketState = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<moneyMarket.market.State>, 'id' | 'address'>,
) => {
  return wasmQuery<moneyMarket.market.State, moneyMarket.market.StateResponse>(
    client,
    {
      ...options,
      id: 'moneyMarket_market_State',
      address: address.moneyMarket.market,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOracleConfig(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.oracle.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.oracle.Config,
    moneyMarket.oracle.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Config',
    address: address.moneyMarket.oracle,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOracleConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<moneyMarket.oracle.Config>, 'id' | 'address'>,
) => {
  return wasmQuery<
    moneyMarket.oracle.Config,
    moneyMarket.oracle.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_oracle_Config',
    address: address.moneyMarket.oracle,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOracleFeeder(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.oracle.Feeder>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.oracle.Feeder,
    moneyMarket.oracle.FeederResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Feeder',
    address: address.moneyMarket.oracle,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOracleFeeder = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<moneyMarket.oracle.Feeder>, 'id' | 'address'>,
) => {
  return wasmQuery<
    moneyMarket.oracle.Feeder,
    moneyMarket.oracle.FeederResponse
  >(client, {
    ...options,
    id: 'moneyMarket_oracle_Feeder',
    address: address.moneyMarket.oracle,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOraclePrice(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.oracle.Price>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.oracle.Price,
    moneyMarket.oracle.PriceResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Price',
    address: address.moneyMarket.oracle,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOraclePrice = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<moneyMarket.oracle.Price>, 'id' | 'address'>,
) => {
  return wasmQuery<moneyMarket.oracle.Price, moneyMarket.oracle.PriceResponse>(
    client,
    {
      ...options,
      id: 'moneyMarket_oracle_Price',
      address: address.moneyMarket.oracle,
    },
  ).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOraclePrices(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.oracle.Prices>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.oracle.Prices,
    moneyMarket.oracle.PricesResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Prices',
    address: address.moneyMarket.oracle,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOraclePrices = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<WasmQueryOptions<moneyMarket.oracle.Prices>, 'id' | 'address'>,
) => {
  return wasmQuery<
    moneyMarket.oracle.Prices,
    moneyMarket.oracle.PricesResponse
  >(client, {
    ...options,
    id: 'moneyMarket_oracle_Prices',
    address: address.moneyMarket.oracle,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOverseerAllCollaterals(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.overseer.AllCollaterals>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.overseer.AllCollaterals,
    moneyMarket.overseer.AllCollateralsResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_AllCollaterals',
    address: address.moneyMarket.overseer,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOverseerAllCollaterals = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.overseer.AllCollaterals>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.overseer.AllCollaterals,
    moneyMarket.overseer.AllCollateralsResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_AllCollaterals',
    address: address.moneyMarket.overseer,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOverseerBorrowLimit(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.overseer.BorrowLimit>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.overseer.BorrowLimit,
    moneyMarket.overseer.BorrowLimitResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_BorrowLimit',
    address: address.moneyMarket.overseer,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOverseerBorrowLimit = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.overseer.BorrowLimit>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.overseer.BorrowLimit,
    moneyMarket.overseer.BorrowLimitResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_BorrowLimit',
    address: address.moneyMarket.overseer,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOverseerCollaterals(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.overseer.Collaterals>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.overseer.Collaterals,
    moneyMarket.overseer.CollateralsResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_Collaterals',
    address: address.moneyMarket.overseer,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOverseerCollaterals = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.overseer.Collaterals>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.overseer.Collaterals,
    moneyMarket.overseer.CollateralsResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_Collaterals',
    address: address.moneyMarket.overseer,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOverseerConfig(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.overseer.Config>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.overseer.Config,
    moneyMarket.overseer.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_Config',
    address: address.moneyMarket.overseer,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOverseerConfig = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.overseer.Config>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.overseer.Config,
    moneyMarket.overseer.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_Config',
    address: address.moneyMarket.overseer,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOverseerDistributionParams(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.overseer.DistributionParams>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.overseer.DistributionParams,
    moneyMarket.overseer.DistributionParamsResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_DistributionParams',
    address: address.moneyMarket.overseer,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOverseerDistributionParams = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.overseer.DistributionParams>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.overseer.DistributionParams,
    moneyMarket.overseer.DistributionParamsResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_DistributionParams',
    address: address.moneyMarket.overseer,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOverseerEpochState(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.overseer.EpochState>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_EpochState',
    address: address.moneyMarket.overseer,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOverseerEpochState = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.overseer.EpochState>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_EpochState',
    address: address.moneyMarket.overseer,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export function useMoneyMarketOverseerWhitelist(
  options: Omit<
    UseWasmQueryOptions<moneyMarket.overseer.Whitelist>,
    'id' | 'address'
  >,
) {
  const { address, onError } = useQueryDependency();

  return useWasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_Whitelist',
    address: address.moneyMarket.overseer,
    onError: options.onError ?? onError,
  });
}

export const queryMoneyMarketOverseerWhitelist = ({
  client,
  address,
  onError,
}: QueryDependency) => (
  options: Omit<
    WasmQueryOptions<moneyMarket.overseer.Whitelist>,
    'id' | 'address'
  >,
) => {
  return wasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_Whitelist',
    address: address.moneyMarket.overseer,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};
