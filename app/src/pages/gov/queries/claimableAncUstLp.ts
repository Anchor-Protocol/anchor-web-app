import type { uAncUstLP } from '@anchor-protocol/types';
import { anchorToken, cw20, WASMContractResult } from '@anchor-protocol/types';
import { useConnectedWallet } from '@anchor-protocol/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { useLastSyncedHeight } from 'base/queries/lastSyncedHeight';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  userLPBalance: WASMContractResult;
  userLPStakingInfo: WASMContractResult;
}

export interface Data {
  userLPBalance: WASMContractResult<cw20.BalanceResponse<uAncUstLP>>;
  userLPStakingInfo: WASMContractResult<anchorToken.staking.StakerInfoResponse>;
}

export const dataMap = createMap<RawData, Data>({
  userLPBalance: (existing, { userLPBalance }) => {
    return parseResult(existing.userLPBalance, userLPBalance.Result);
  },

  userLPStakingInfo: (existing, { userLPStakingInfo }) => {
    return parseResult(existing.userLPStakingInfo, userLPStakingInfo.Result);
  },
});

export interface RawVariables {
  ANCUST_LP_Token_contract: string;
  ANCUSTLPBalanceQuery: string;
  ANCUST_LP_Staking_contract: string;
  UserLPStakingInfoQuery: string;
}

export interface Variables {
  ANCUST_LP_Token_contract: string;
  ANCUST_LP_Staking_contract: string;
  ANCUSTLPBalanceQuery: cw20.Balance;
  UserLPStakingInfoQuery: anchorToken.staking.StakerInfo;
}

export function mapVariables({
  ANCUST_LP_Token_contract,
  ANCUST_LP_Staking_contract,
  ANCUSTLPBalanceQuery,
  UserLPStakingInfoQuery,
}: Variables): RawVariables {
  return {
    ANCUST_LP_Token_contract,
    ANCUSTLPBalanceQuery: JSON.stringify(ANCUSTLPBalanceQuery),
    ANCUST_LP_Staking_contract,
    UserLPStakingInfoQuery: JSON.stringify(UserLPStakingInfoQuery),
  };
}

export const query = gql`
  query __claimableAncUstLp(
    $ANCUST_LP_Token_contract: String!
    $ANCUSTLPBalanceQuery: String!
    $ANCUST_LP_Staking_contract: String!
    $UserLPStakingInfoQuery: String!
  ) {
    userLPBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANCUST_LP_Token_contract
      QueryMsg: $ANCUSTLPBalanceQuery
    ) {
      Result
    }

    userLPStakingInfo: WasmContractsContractAddressStore(
      ContractAddress: $ANCUST_LP_Staking_contract
      QueryMsg: $UserLPStakingInfoQuery
    ) {
      Result
    }
  }
`;

export function useClaimableAncUstLp(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { data: lastSyncedHeight } = useLastSyncedHeight();

  const userWallet = useConnectedWallet();

  const { anchorToken, cw20 } = useContractAddress();

  const variables = useMemo(() => {
    if (
      !userWallet ||
      typeof lastSyncedHeight !== 'number' ||
      lastSyncedHeight === 0
    )
      return undefined;

    return mapVariables({
      ANCUST_LP_Token_contract: cw20.AncUstLP,
      ANCUST_LP_Staking_contract: anchorToken.staking,
      ANCUSTLPBalanceQuery: {
        balance: {
          address: userWallet.walletAddress,
        },
      },
      UserLPStakingInfoQuery: {
        staker_info: {
          staker: userWallet.walletAddress,
          block_height: lastSyncedHeight,
        },
      },
    });
  }, [anchorToken.staking, cw20.AncUstLP, lastSyncedHeight, userWallet]);

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
    //pollInterval: 1000 * 60,
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
