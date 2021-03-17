import {
  anchorToken,
  ContractAddress,
  cw20,
  uANC,
  WASMContractResult,
} from '@anchor-protocol/types';
import { gql, useQuery } from '@apollo/client';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  ancTokenInfo: WASMContractResult;
  govANCBalance: WASMContractResult;
  communityANCBalance: WASMContractResult;
  distributorANCBalance: WASMContractResult;
  lpStakingANCBalance: WASMContractResult;
  airdropANCBalance: WASMContractResult;
  investorTeamLockANCBalance: WASMContractResult;
  govState: WASMContractResult;
  govConfig: WASMContractResult;
}

export interface Data {
  ancTokenInfo: WASMContractResult<cw20.TokenInfoResponse<uANC>>;
  govANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  communityANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  distributorANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  lpStakingANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  airdropANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  investorTeamLockANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  govState: WASMContractResult<anchorToken.gov.StateResponse>;
  govConfig: WASMContractResult<anchorToken.gov.ConfigResponse>;
}

export const dataMap = createMap<RawData, Data>({
  ancTokenInfo: (existing, { ancTokenInfo }) => {
    return parseResult(existing.ancTokenInfo, ancTokenInfo.Result);
  },
  govANCBalance: (existing, { govANCBalance }) => {
    return parseResult(existing.govANCBalance, govANCBalance.Result);
  },
  communityANCBalance: (existing, { communityANCBalance }) => {
    return parseResult(
      existing.communityANCBalance,
      communityANCBalance.Result,
    );
  },
  distributorANCBalance: (existing, { distributorANCBalance }) => {
    return parseResult(
      existing.distributorANCBalance,
      distributorANCBalance.Result,
    );
  },
  lpStakingANCBalance: (existing, { lpStakingANCBalance }) => {
    return parseResult(
      existing.lpStakingANCBalance,
      lpStakingANCBalance.Result,
    );
  },
  airdropANCBalance: (existing, { airdropANCBalance }) => {
    return parseResult(existing.airdropANCBalance, airdropANCBalance.Result);
  },
  investorTeamLockANCBalance: (existing, { investorTeamLockANCBalance }) => {
    return parseResult(
      existing.investorTeamLockANCBalance,
      investorTeamLockANCBalance.Result,
    );
  },
  govState: (existing, { govState }) => {
    return parseResult(existing.govState, govState.Result);
  },
  govConfig: (existing, { govConfig }) => {
    return parseResult(existing.govConfig, govConfig.Result);
  },
});

export interface RawVariables {
  ANC_token_contract: string;
  ANCTokenInfoQuery: string;
  GovANCTokenBalanceQuery: string;
  CommunityANCTokenBalanceQuery: string;
  DistributorANCTokenBalanceQuery: string;
  LPStakingANCTokenBalanceQuery: string;
  AirdropANCTokenBalanceQuery: string;
  InvestorTeamLockANCTokenBalanceQuery: string;
  Gov_contract: string;
  GovStateQuery: string;
  GovConfigQuery: string;
}

export interface Variables {
  address: ContractAddress;
}

export function mapVariables({ address }: Variables): RawVariables {
  return {
    ANC_token_contract: address.cw20.ANC,
    ANCTokenInfoQuery: JSON.stringify({
      token_info: {},
    }),
    GovANCTokenBalanceQuery: JSON.stringify({
      balance: {
        address: address.anchorToken.gov,
      },
    }),
    CommunityANCTokenBalanceQuery: JSON.stringify({
      balance: {
        address: address.anchorToken.community,
      },
    }),
    DistributorANCTokenBalanceQuery: JSON.stringify({
      balance: {
        address: address.anchorToken.distributor,
      },
    }),
    LPStakingANCTokenBalanceQuery: JSON.stringify({
      balance: {
        address: address.anchorToken.staking,
      },
    }),
    AirdropANCTokenBalanceQuery: JSON.stringify({
      balance: {
        // TODO hard coding
        address: 'terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm',
      },
    }),
    InvestorTeamLockANCTokenBalanceQuery: JSON.stringify({
      balance: {
        // TODO hard coding
        address: 'terra1dp0taj85ruc299rkdvzp4z5pfg6z6swaed74e6',
        //address: address.anchorToken.investorLock,
      },
    }),
    Gov_contract: address.anchorToken.gov,
    GovStateQuery: JSON.stringify({
      state: {},
    }),
    GovConfigQuery: JSON.stringify({
      config: {},
    }),
  };
}

export const query = gql`
  query __totalStakedMain(
    $ANC_token_contract: String!
    $ANCTokenInfoQuery: String!
    $GovANCTokenBalanceQuery: String!
    $CommunityANCTokenBalanceQuery: String!
    $DistributorANCTokenBalanceQuery: String!
    $LPStakingANCTokenBalanceQuery: String!
    $AirdropANCTokenBalanceQuery: String!
    $InvestorTeamLockANCTokenBalanceQuery: String!
    $Gov_contract: String!
    $GovStateQuery: String!
    $GovConfigQuery: String!
  ) {
    ancTokenInfo: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $ANCTokenInfoQuery
    ) {
      Result
    }

    govANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $GovANCTokenBalanceQuery
    ) {
      Result
    }

    communityANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $CommunityANCTokenBalanceQuery
    ) {
      Result
    }

    distributorANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $DistributorANCTokenBalanceQuery
    ) {
      Result
    }

    lpStakingANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $LPStakingANCTokenBalanceQuery
    ) {
      Result
    }

    airdropANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $AirdropANCTokenBalanceQuery
    ) {
      Result
    }

    investorTeamLockANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $InvestorTeamLockANCTokenBalanceQuery
    ) {
      Result
    }

    govState: WasmContractsContractAddressStore(
      ContractAddress: $Gov_contract
      QueryMsg: $GovStateQuery
    ) {
      Result
    }

    govConfig: WasmContractsContractAddressStore(
      ContractAddress: $Gov_contract
      QueryMsg: $GovConfigQuery
    ) {
      Result
    }
  }
`;

export function useTotalStakedMain(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const address = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      address,
    });
  }, [address]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 60,
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
