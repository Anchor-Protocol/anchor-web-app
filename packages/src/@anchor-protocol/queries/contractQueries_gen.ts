// THIS FILE WAS AUTO GENERATED
// DO NOT EDIT MANUALLY
// YOU CAN SEE THE GENERATOR SCRIPTS ON PACKAGE.JSON

import {
  anchorToken,
  bluna,
  liquidation,
  moneyMarket,
  ContractAddress,
} from '@anchor-protocol/types';
import { ApolloClient } from '@apollo/client';
import { Omit } from '@material-ui/core';
import {
  useWasmQuery,
  UseWasmQueryOptions,
  wasmQuery,
  WasmQueryOptions,
} from './wasmQuery';

export function useAnchorTokenCollectorConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.collector.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    anchorToken.collector.Config,
    anchorToken.collector.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_collector_Config',
    address: address.anchorToken.collector,
  });
}

export function queryAnchorTokenCollectorConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.collector.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    anchorToken.collector.Config,
    anchorToken.collector.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_collector_Config',
    address: address.anchorToken.collector,
  });
}

export function useAnchorTokenCommunityConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.community.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    anchorToken.community.Config,
    anchorToken.community.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_community_Config',
    address: address.anchorToken.community,
  });
}

export function queryAnchorTokenCommunityConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.community.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    anchorToken.community.Config,
    anchorToken.community.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_community_Config',
    address: address.anchorToken.community,
  });
}

export function useAnchorTokenDistributorConfig({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<anchorToken.distributor.Config>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    anchorToken.distributor.Config,
    anchorToken.distributor.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_distributor_Config',
    address: address.anchorToken.distributor,
  });
}

export function queryAnchorTokenDistributorConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<anchorToken.distributor.Config>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    anchorToken.distributor.Config,
    anchorToken.distributor.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_distributor_Config',
    address: address.anchorToken.distributor,
  });
}

export function useAnchorTokenGovConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.gov.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>({
    ...options,
    id: 'anchorToken_gov_Config',
    address: address.anchorToken.gov,
  });
}

export function queryAnchorTokenGovConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.gov.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Config',
      address: address.anchorToken.gov,
    },
  );
}

export function useAnchorTokenGovPoll({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.gov.Poll>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<anchorToken.gov.Poll, anchorToken.gov.PollResponse>({
    ...options,
    id: 'anchorToken_gov_Poll',
    address: address.anchorToken.gov,
  });
}

export function queryAnchorTokenGovPoll(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.gov.Poll>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<anchorToken.gov.Poll, anchorToken.gov.PollResponse>(client, {
    ...options,
    id: 'anchorToken_gov_Poll',
    address: address.anchorToken.gov,
  });
}

export function useAnchorTokenGovPolls({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.gov.Polls>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>({
    ...options,
    id: 'anchorToken_gov_Polls',
    address: address.anchorToken.gov,
  });
}

export function queryAnchorTokenGovPolls(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.gov.Polls>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Polls',
      address: address.anchorToken.gov,
    },
  );
}

export function useAnchorTokenGovStaker({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.gov.Staker>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<anchorToken.gov.Staker, anchorToken.gov.StakerResponse>({
    ...options,
    id: 'anchorToken_gov_Staker',
    address: address.anchorToken.gov,
  });
}

export function queryAnchorTokenGovStaker(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.gov.Staker>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<anchorToken.gov.Staker, anchorToken.gov.StakerResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Staker',
      address: address.anchorToken.gov,
    },
  );
}

export function useAnchorTokenGovState({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.gov.State>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<anchorToken.gov.State, anchorToken.gov.StateResponse>({
    ...options,
    id: 'anchorToken_gov_State',
    address: address.anchorToken.gov,
  });
}

export function queryAnchorTokenGovState(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.gov.State>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<anchorToken.gov.State, anchorToken.gov.StateResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_State',
      address: address.anchorToken.gov,
    },
  );
}

export function useAnchorTokenGovVoters({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.gov.Voters>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<anchorToken.gov.Voters, anchorToken.gov.VotersResponse>({
    ...options,
    id: 'anchorToken_gov_Voters',
    address: address.anchorToken.gov,
  });
}

export function queryAnchorTokenGovVoters(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.gov.Voters>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<anchorToken.gov.Voters, anchorToken.gov.VotersResponse>(
    client,
    {
      ...options,
      id: 'anchorToken_gov_Voters',
      address: address.anchorToken.gov,
    },
  );
}

export function useAnchorTokenStakingConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.staking.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    anchorToken.staking.Config,
    anchorToken.staking.ConfigResponse
  >({
    ...options,
    id: 'anchorToken_staking_Config',
    address: address.anchorToken.staking,
  });
}

export function queryAnchorTokenStakingConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.staking.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    anchorToken.staking.Config,
    anchorToken.staking.ConfigResponse
  >(client, {
    ...options,
    id: 'anchorToken_staking_Config',
    address: address.anchorToken.staking,
  });
}

export function useAnchorTokenStakingStakerInfo({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<anchorToken.staking.StakerInfo>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >({
    ...options,
    id: 'anchorToken_staking_StakerInfo',
    address: address.anchorToken.staking,
  });
}

export function queryAnchorTokenStakingStakerInfo(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<anchorToken.staking.StakerInfo>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >(client, {
    ...options,
    id: 'anchorToken_staking_StakerInfo',
    address: address.anchorToken.staking,
  });
}

export function useAnchorTokenStakingState({
  address,
  ...options
}: Omit<UseWasmQueryOptions<anchorToken.staking.State>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    anchorToken.staking.State,
    anchorToken.staking.StateResponse
  >({
    ...options,
    id: 'anchorToken_staking_State',
    address: address.anchorToken.staking,
  });
}

export function queryAnchorTokenStakingState(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<anchorToken.staking.State>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    anchorToken.staking.State,
    anchorToken.staking.StateResponse
  >(client, {
    ...options,
    id: 'anchorToken_staking_State',
    address: address.anchorToken.staking,
  });
}

export function useBlunaAirdropRegistryAirdropInfo({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<bluna.airdropRegistry.AirdropInfo>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    bluna.airdropRegistry.AirdropInfo,
    bluna.airdropRegistry.AirdropInfoResponse
  >({
    ...options,
    id: 'bluna_airdropRegistry_AirdropInfo',
    address: address.bluna.airdropRegistry,
  });
}

export function queryBlunaAirdropRegistryAirdropInfo(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<bluna.airdropRegistry.AirdropInfo>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    bluna.airdropRegistry.AirdropInfo,
    bluna.airdropRegistry.AirdropInfoResponse
  >(client, {
    ...options,
    id: 'bluna_airdropRegistry_AirdropInfo',
    address: address.bluna.airdropRegistry,
  });
}

export function useBlunaAirdropRegistryConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.airdropRegistry.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    bluna.airdropRegistry.Config,
    bluna.airdropRegistry.ConfigResponse
  >({
    ...options,
    id: 'bluna_airdropRegistry_Config',
    address: address.bluna.airdropRegistry,
  });
}

export function queryBlunaAirdropRegistryConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.airdropRegistry.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    bluna.airdropRegistry.Config,
    bluna.airdropRegistry.ConfigResponse
  >(client, {
    ...options,
    id: 'bluna_airdropRegistry_Config',
    address: address.bluna.airdropRegistry,
  });
}

export function useBlunaHubAllHistory({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.hub.AllHistory>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.hub.AllHistory, bluna.hub.AllHistoryResponse>({
    ...options,
    id: 'bluna_hub_AllHistory',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubAllHistory(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.hub.AllHistory>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.hub.AllHistory, bluna.hub.AllHistoryResponse>(client, {
    ...options,
    id: 'bluna_hub_AllHistory',
    address: address.bluna.hub,
  });
}

export function useBlunaHubConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.hub.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.hub.Config, bluna.hub.ConfigResponse>({
    ...options,
    id: 'bluna_hub_Config',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.hub.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.hub.Config, bluna.hub.ConfigResponse>(client, {
    ...options,
    id: 'bluna_hub_Config',
    address: address.bluna.hub,
  });
}

export function useBlunaHubCurrentBatch({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.hub.CurrentBatch>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.hub.CurrentBatch, bluna.hub.CurrentBatchResponse>({
    ...options,
    id: 'bluna_hub_CurrentBatch',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubCurrentBatch(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.hub.CurrentBatch>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.hub.CurrentBatch, bluna.hub.CurrentBatchResponse>(
    client,
    {
      ...options,
      id: 'bluna_hub_CurrentBatch',
      address: address.bluna.hub,
    },
  );
}

export function useBlunaHubParameters({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.hub.Parameters>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>({
    ...options,
    id: 'bluna_hub_Parameters',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubParameters(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.hub.Parameters>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>(client, {
    ...options,
    id: 'bluna_hub_Parameters',
    address: address.bluna.hub,
  });
}

export function useBlunaHubState({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.hub.State>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.hub.State, bluna.hub.StateResponse>({
    ...options,
    id: 'bluna_hub_State',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubState(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.hub.State>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.hub.State, bluna.hub.StateResponse>(client, {
    ...options,
    id: 'bluna_hub_State',
    address: address.bluna.hub,
  });
}

export function useBlunaHubUnbondRequests({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.hub.UnbondRequests>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    bluna.hub.UnbondRequests,
    bluna.hub.UnbondRequestsResponse
  >({
    ...options,
    id: 'bluna_hub_UnbondRequests',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubUnbondRequests(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.hub.UnbondRequests>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.hub.UnbondRequests, bluna.hub.UnbondRequestsResponse>(
    client,
    {
      ...options,
      id: 'bluna_hub_UnbondRequests',
      address: address.bluna.hub,
    },
  );
}

export function useBlunaHubWhitelistedValidators({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<bluna.hub.WhitelistedValidators>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    bluna.hub.WhitelistedValidators,
    bluna.hub.WhitelistedValidatorsResponse
  >({
    ...options,
    id: 'bluna_hub_WhitelistedValidators',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubWhitelistedValidators(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<bluna.hub.WhitelistedValidators>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    bluna.hub.WhitelistedValidators,
    bluna.hub.WhitelistedValidatorsResponse
  >(client, {
    ...options,
    id: 'bluna_hub_WhitelistedValidators',
    address: address.bluna.hub,
  });
}

export function useBlunaHubWithdrawableUnbonded({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<bluna.hub.WithdrawableUnbonded>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    bluna.hub.WithdrawableUnbonded,
    bluna.hub.WithdrawableUnbondedResponse
  >({
    ...options,
    id: 'bluna_hub_WithdrawableUnbonded',
    address: address.bluna.hub,
  });
}

export function queryBlunaHubWithdrawableUnbonded(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<bluna.hub.WithdrawableUnbonded>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    bluna.hub.WithdrawableUnbonded,
    bluna.hub.WithdrawableUnbondedResponse
  >(client, {
    ...options,
    id: 'bluna_hub_WithdrawableUnbonded',
    address: address.bluna.hub,
  });
}

export function useBlunaRewardAccruedRewards({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.reward.AccruedRewards>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    bluna.reward.AccruedRewards,
    bluna.reward.AccruedRewardsResponse
  >({
    ...options,
    id: 'bluna_reward_AccruedRewards',
    address: address.bluna.reward,
  });
}

export function queryBlunaRewardAccruedRewards(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.reward.AccruedRewards>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    bluna.reward.AccruedRewards,
    bluna.reward.AccruedRewardsResponse
  >(client, {
    ...options,
    id: 'bluna_reward_AccruedRewards',
    address: address.bluna.reward,
  });
}

export function useBlunaRewardConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.reward.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.reward.Config, bluna.reward.ConfigResponse>({
    ...options,
    id: 'bluna_reward_Config',
    address: address.bluna.reward,
  });
}

export function queryBlunaRewardConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.reward.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.reward.Config, bluna.reward.ConfigResponse>(client, {
    ...options,
    id: 'bluna_reward_Config',
    address: address.bluna.reward,
  });
}

export function useBlunaRewardHolder({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.reward.Holder>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.reward.Holder, bluna.reward.HolderResponse>({
    ...options,
    id: 'bluna_reward_Holder',
    address: address.bluna.reward,
  });
}

export function queryBlunaRewardHolder(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.reward.Holder>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.reward.Holder, bluna.reward.HolderResponse>(client, {
    ...options,
    id: 'bluna_reward_Holder',
    address: address.bluna.reward,
  });
}

export function useBlunaRewardHolders({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.reward.Holders>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.reward.Holders, bluna.reward.HoldersResponse>({
    ...options,
    id: 'bluna_reward_Holders',
    address: address.bluna.reward,
  });
}

export function queryBlunaRewardHolders(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.reward.Holders>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.reward.Holders, bluna.reward.HoldersResponse>(client, {
    ...options,
    id: 'bluna_reward_Holders',
    address: address.bluna.reward,
  });
}

export function useBlunaRewardState({
  address,
  ...options
}: Omit<UseWasmQueryOptions<bluna.reward.State>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<bluna.reward.State, bluna.reward.StateResponse>({
    ...options,
    id: 'bluna_reward_State',
    address: address.bluna.reward,
  });
}

export function queryBlunaRewardState(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<bluna.reward.State>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<bluna.reward.State, bluna.reward.StateResponse>(client, {
    ...options,
    id: 'bluna_reward_State',
    address: address.bluna.reward,
  });
}

export function useLiquidationLiquidationContractBid({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<liquidation.liquidationContract.Bid>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    liquidation.liquidationContract.Bid,
    liquidation.liquidationContract.BidResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_Bid',
    address: address.liquidation.liquidationContract,
  });
}

export function queryLiquidationLiquidationContractBid(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<liquidation.liquidationContract.Bid>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    liquidation.liquidationContract.Bid,
    liquidation.liquidationContract.BidResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_Bid',
    address: address.liquidation.liquidationContract,
  });
}

export function useLiquidationLiquidationContractBidsByCollateral({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<liquidation.liquidationContract.BidsByCollateral>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    liquidation.liquidationContract.BidsByCollateral,
    liquidation.liquidationContract.BidsByCollateralResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_BidsByCollateral',
    address: address.liquidation.liquidationContract,
  });
}

export function queryLiquidationLiquidationContractBidsByCollateral(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<liquidation.liquidationContract.BidsByCollateral>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    liquidation.liquidationContract.BidsByCollateral,
    liquidation.liquidationContract.BidsByCollateralResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_BidsByCollateral',
    address: address.liquidation.liquidationContract,
  });
}

export function useLiquidationLiquidationContractBidsByUser({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<liquidation.liquidationContract.BidsByUser>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    liquidation.liquidationContract.BidsByUser,
    liquidation.liquidationContract.BidsByUserResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_BidsByUser',
    address: address.liquidation.liquidationContract,
  });
}

export function queryLiquidationLiquidationContractBidsByUser(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<liquidation.liquidationContract.BidsByUser>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    liquidation.liquidationContract.BidsByUser,
    liquidation.liquidationContract.BidsByUserResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_BidsByUser',
    address: address.liquidation.liquidationContract,
  });
}

export function useLiquidationLiquidationContractConfig({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<liquidation.liquidationContract.Config>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    liquidation.liquidationContract.Config,
    liquidation.liquidationContract.ConfigResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_Config',
    address: address.liquidation.liquidationContract,
  });
}

export function queryLiquidationLiquidationContractConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<liquidation.liquidationContract.Config>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    liquidation.liquidationContract.Config,
    liquidation.liquidationContract.ConfigResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_Config',
    address: address.liquidation.liquidationContract,
  });
}

export function useLiquidationLiquidationContractLiquidationAmount({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<liquidation.liquidationContract.LiquidationAmount>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    liquidation.liquidationContract.LiquidationAmount,
    liquidation.liquidationContract.LiquidationAmountResponse
  >({
    ...options,
    id: 'liquidation_liquidationContract_LiquidationAmount',
    address: address.liquidation.liquidationContract,
  });
}

export function queryLiquidationLiquidationContractLiquidationAmount(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<liquidation.liquidationContract.LiquidationAmount>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    liquidation.liquidationContract.LiquidationAmount,
    liquidation.liquidationContract.LiquidationAmountResponse
  >(client, {
    ...options,
    id: 'liquidation_liquidationContract_LiquidationAmount',
    address: address.liquidation.liquidationContract,
  });
}

export function useMoneyMarketCustodyBorrower({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.custody.Borrower>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.custody.Borrower,
    moneyMarket.custody.BorrowerResponse
  >({
    ...options,
    id: 'moneyMarket_custody_Borrower',
    address: address.moneyMarket.custody,
  });
}

export function queryMoneyMarketCustodyBorrower(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.custody.Borrower>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.custody.Borrower,
    moneyMarket.custody.BorrowerResponse
  >(client, {
    ...options,
    id: 'moneyMarket_custody_Borrower',
    address: address.moneyMarket.custody,
  });
}

export function useMoneyMarketCustodyBorrowers({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.custody.Borrowers>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.custody.Borrowers,
    moneyMarket.custody.BorrowersResponse
  >({
    ...options,
    id: 'moneyMarket_custody_Borrowers',
    address: address.moneyMarket.custody,
  });
}

export function queryMoneyMarketCustodyBorrowers(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.custody.Borrowers>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.custody.Borrowers,
    moneyMarket.custody.BorrowersResponse
  >(client, {
    ...options,
    id: 'moneyMarket_custody_Borrowers',
    address: address.moneyMarket.custody,
  });
}

export function useMoneyMarketCustodyConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.custody.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.custody.Config,
    moneyMarket.custody.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_custody_Config',
    address: address.moneyMarket.custody,
  });
}

export function queryMoneyMarketCustodyConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.custody.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.custody.Config,
    moneyMarket.custody.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_custody_Config',
    address: address.moneyMarket.custody,
  });
}

export function useMoneyMarketDistributionModelAncEmissionRate({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.distributionModel.AncEmissionRate>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.distributionModel.AncEmissionRate,
    moneyMarket.distributionModel.AncEmissionRateResponse
  >({
    ...options,
    id: 'moneyMarket_distributionModel_AncEmissionRate',
    address: address.moneyMarket.distributionModel,
  });
}

export function queryMoneyMarketDistributionModelAncEmissionRate(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.distributionModel.AncEmissionRate>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.distributionModel.AncEmissionRate,
    moneyMarket.distributionModel.AncEmissionRateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_distributionModel_AncEmissionRate',
    address: address.moneyMarket.distributionModel,
  });
}

export function useMoneyMarketDistributionModelConfig({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.distributionModel.Config>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.distributionModel.Config,
    moneyMarket.distributionModel.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_distributionModel_Config',
    address: address.moneyMarket.distributionModel,
  });
}

export function queryMoneyMarketDistributionModelConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.distributionModel.Config>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.distributionModel.Config,
    moneyMarket.distributionModel.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_distributionModel_Config',
    address: address.moneyMarket.distributionModel,
  });
}

export function useMoneyMarketInterestModelBorrowRate({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.interestModel.BorrowRate>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.interestModel.BorrowRate,
    moneyMarket.interestModel.BorrowRateResponse
  >({
    ...options,
    id: 'moneyMarket_interestModel_BorrowRate',
    address: address.moneyMarket.interestModel,
  });
}

export function queryMoneyMarketInterestModelBorrowRate(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.interestModel.BorrowRate>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.interestModel.BorrowRate,
    moneyMarket.interestModel.BorrowRateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_interestModel_BorrowRate',
    address: address.moneyMarket.interestModel,
  });
}

export function useMoneyMarketInterestModelConfig({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.interestModel.Config>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.interestModel.Config,
    moneyMarket.interestModel.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_interestModel_Config',
    address: address.moneyMarket.interestModel,
  });
}

export function queryMoneyMarketInterestModelConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.interestModel.Config>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.interestModel.Config,
    moneyMarket.interestModel.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_interestModel_Config',
    address: address.moneyMarket.interestModel,
  });
}

export function useMoneyMarketMarketBorrowInfo({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.market.BorrowInfo>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.market.BorrowInfo,
    moneyMarket.market.BorrowInfoResponse
  >({
    ...options,
    id: 'moneyMarket_market_BorrowInfo',
    address: address.moneyMarket.market,
  });
}

export function queryMoneyMarketMarketBorrowInfo(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.market.BorrowInfo>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.market.BorrowInfo,
    moneyMarket.market.BorrowInfoResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_BorrowInfo',
    address: address.moneyMarket.market,
  });
}

export function useMoneyMarketMarketBorrowInfos({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.market.BorrowInfos>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.market.BorrowInfos,
    moneyMarket.market.BorrowInfosResponse
  >({
    ...options,
    id: 'moneyMarket_market_BorrowInfos',
    address: address.moneyMarket.market,
  });
}

export function queryMoneyMarketMarketBorrowInfos(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.market.BorrowInfos>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.market.BorrowInfos,
    moneyMarket.market.BorrowInfosResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_BorrowInfos',
    address: address.moneyMarket.market,
  });
}

export function useMoneyMarketMarketConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.market.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.market.Config,
    moneyMarket.market.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_market_Config',
    address: address.moneyMarket.market,
  });
}

export function queryMoneyMarketMarketConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.market.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.market.Config,
    moneyMarket.market.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_Config',
    address: address.moneyMarket.market,
  });
}

export function useMoneyMarketMarketEpochState({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.market.EpochState>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.market.EpochState,
    moneyMarket.market.EpochStateResponse
  >({
    ...options,
    id: 'moneyMarket_market_EpochState',
    address: address.moneyMarket.market,
  });
}

export function queryMoneyMarketMarketEpochState(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.market.EpochState>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.market.EpochState,
    moneyMarket.market.EpochStateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_market_EpochState',
    address: address.moneyMarket.market,
  });
}

export function useMoneyMarketMarketState({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.market.State>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >({
    ...options,
    id: 'moneyMarket_market_State',
    address: address.moneyMarket.market,
  });
}

export function queryMoneyMarketMarketState(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.market.State>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<moneyMarket.market.State, moneyMarket.market.StateResponse>(
    client,
    {
      ...options,
      id: 'moneyMarket_market_State',
      address: address.moneyMarket.market,
    },
  );
}

export function useMoneyMarketOracleConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.oracle.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.oracle.Config,
    moneyMarket.oracle.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Config',
    address: address.moneyMarket.oracle,
  });
}

export function queryMoneyMarketOracleConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.oracle.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.oracle.Config,
    moneyMarket.oracle.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_oracle_Config',
    address: address.moneyMarket.oracle,
  });
}

export function useMoneyMarketOracleFeeder({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.oracle.Feeder>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.oracle.Feeder,
    moneyMarket.oracle.FeederResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Feeder',
    address: address.moneyMarket.oracle,
  });
}

export function queryMoneyMarketOracleFeeder(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.oracle.Feeder>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.oracle.Feeder,
    moneyMarket.oracle.FeederResponse
  >(client, {
    ...options,
    id: 'moneyMarket_oracle_Feeder',
    address: address.moneyMarket.oracle,
  });
}

export function useMoneyMarketOraclePrice({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.oracle.Price>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.oracle.Price,
    moneyMarket.oracle.PriceResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Price',
    address: address.moneyMarket.oracle,
  });
}

export function queryMoneyMarketOraclePrice(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.oracle.Price>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<moneyMarket.oracle.Price, moneyMarket.oracle.PriceResponse>(
    client,
    {
      ...options,
      id: 'moneyMarket_oracle_Price',
      address: address.moneyMarket.oracle,
    },
  );
}

export function useMoneyMarketOraclePrices({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.oracle.Prices>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.oracle.Prices,
    moneyMarket.oracle.PricesResponse
  >({
    ...options,
    id: 'moneyMarket_oracle_Prices',
    address: address.moneyMarket.oracle,
  });
}

export function queryMoneyMarketOraclePrices(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.oracle.Prices>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.oracle.Prices,
    moneyMarket.oracle.PricesResponse
  >(client, {
    ...options,
    id: 'moneyMarket_oracle_Prices',
    address: address.moneyMarket.oracle,
  });
}

export function useMoneyMarketOverseerAllCollaterals({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.overseer.AllCollaterals>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.overseer.AllCollaterals,
    moneyMarket.overseer.AllCollateralsResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_AllCollaterals',
    address: address.moneyMarket.overseer,
  });
}

export function queryMoneyMarketOverseerAllCollaterals(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.overseer.AllCollaterals>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.overseer.AllCollaterals,
    moneyMarket.overseer.AllCollateralsResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_AllCollaterals',
    address: address.moneyMarket.overseer,
  });
}

export function useMoneyMarketOverseerBorrowLimit({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.overseer.BorrowLimit>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.overseer.BorrowLimit,
    moneyMarket.overseer.BorrowLimitResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_BorrowLimit',
    address: address.moneyMarket.overseer,
  });
}

export function queryMoneyMarketOverseerBorrowLimit(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.overseer.BorrowLimit>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.overseer.BorrowLimit,
    moneyMarket.overseer.BorrowLimitResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_BorrowLimit',
    address: address.moneyMarket.overseer,
  });
}

export function useMoneyMarketOverseerCollaterals({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.overseer.Collaterals>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.overseer.Collaterals,
    moneyMarket.overseer.CollateralsResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_Collaterals',
    address: address.moneyMarket.overseer,
  });
}

export function queryMoneyMarketOverseerCollaterals(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.overseer.Collaterals>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.overseer.Collaterals,
    moneyMarket.overseer.CollateralsResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_Collaterals',
    address: address.moneyMarket.overseer,
  });
}

export function useMoneyMarketOverseerConfig({
  address,
  ...options
}: Omit<UseWasmQueryOptions<moneyMarket.overseer.Config>, 'id' | 'address'> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.overseer.Config,
    moneyMarket.overseer.ConfigResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_Config',
    address: address.moneyMarket.overseer,
  });
}

export function queryMoneyMarketOverseerConfig(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<WasmQueryOptions<moneyMarket.overseer.Config>, 'id' | 'address'> & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.overseer.Config,
    moneyMarket.overseer.ConfigResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_Config',
    address: address.moneyMarket.overseer,
  });
}

export function useMoneyMarketOverseerDistributionParams({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.overseer.DistributionParams>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.overseer.DistributionParams,
    moneyMarket.overseer.DistributionParamsResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_DistributionParams',
    address: address.moneyMarket.overseer,
  });
}

export function queryMoneyMarketOverseerDistributionParams(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.overseer.DistributionParams>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.overseer.DistributionParams,
    moneyMarket.overseer.DistributionParamsResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_DistributionParams',
    address: address.moneyMarket.overseer,
  });
}

export function useMoneyMarketOverseerEpochState({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.overseer.EpochState>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_EpochState',
    address: address.moneyMarket.overseer,
  });
}

export function queryMoneyMarketOverseerEpochState(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.overseer.EpochState>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_EpochState',
    address: address.moneyMarket.overseer,
  });
}

export function useMoneyMarketOverseerWhitelist({
  address,
  ...options
}: Omit<
  UseWasmQueryOptions<moneyMarket.overseer.Whitelist>,
  'id' | 'address'
> & {
  address: ContractAddress;
}) {
  return useWasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >({
    ...options,
    id: 'moneyMarket_overseer_Whitelist',
    address: address.moneyMarket.overseer,
  });
}

export function queryMoneyMarketOverseerWhitelist(
  client: ApolloClient<any>,
  {
    address,
    ...options
  }: Omit<
    WasmQueryOptions<moneyMarket.overseer.Whitelist>,
    'id' | 'address'
  > & {
    address: ContractAddress;
  },
) {
  return wasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >(client, {
    ...options,
    id: 'moneyMarket_overseer_Whitelist',
    address: address.moneyMarket.overseer,
  });
}
