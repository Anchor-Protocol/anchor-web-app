import type { uANC } from '@anchor-protocol/types';
import { cw20, moneyMarket, WASMContractResult } from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
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
  borrowerInfo: WASMContractResult;
  userANCBalance: WASMContractResult;
  marketState: WASMContractResult;
}

export interface Data {
  borrowerInfo: WASMContractResult<moneyMarket.market.BorrowerInfoResponse>;
  userANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  marketState: WASMContractResult<moneyMarket.market.StateResponse>;
}

export const dataMap = createMap<RawData, Data>({
  userANCBalance: (existing, { userANCBalance }) => {
    return parseResult(existing.userANCBalance, userANCBalance.Result);
  },
  marketState: (existing, { marketState }) => {
    return parseResult(existing.marketState, marketState.Result);
  },
  borrowerInfo: (existing, { borrowerInfo }) => {
    return parseResult(existing.borrowerInfo, borrowerInfo.Result);
  },
});

export interface RawVariables {
  Market_contract: string;
  ANC_token_contract: string;
  BorrowerInfoQuery: string;
  UserANCBalanceQuery: string;
  MarketStateQuery: string;
}

export interface Variables {
  Market_contract: string;
  ANC_token_contract: string;
  BorrowerInfoQuery: moneyMarket.market.BorrowerInfo;
  UserANCBalanceQuery: cw20.Balance;
  MarketStateQuery: moneyMarket.market.State;
}

export function mapVariables({
  Market_contract,
  ANC_token_contract,
  BorrowerInfoQuery,
  UserANCBalanceQuery,
  MarketStateQuery,
}: Variables): RawVariables {
  return {
    Market_contract,
    ANC_token_contract,
    BorrowerInfoQuery: JSON.stringify(BorrowerInfoQuery),
    UserANCBalanceQuery: JSON.stringify(UserANCBalanceQuery),
    MarketStateQuery: JSON.stringify(MarketStateQuery),
  };
}

export const query = gql`
  query __claimableUstBorrow(
    $Market_contract: String!
    $ANC_token_contract: String!
    $BorrowerInfoQuery: String!
    $UserANCBalanceQuery: String!
    $MarketStateQuery: String!
  ) {
    borrowerInfo: WasmContractsContractAddressStore(
      ContractAddress: $Market_contract
      QueryMsg: $BorrowerInfoQuery
    ) {
      Result
    }

    userANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANC_token_contract
      QueryMsg: $UserANCBalanceQuery
    ) {
      Result
    }

    marketState: WasmContractsContractAddressStore(
      ContractAddress: $Market_contract
      QueryMsg: $MarketStateQuery
    ) {
      Result
    }
  }
`;

export function useClaimableUstBorrow(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { moneyMarket, cw20 } = useContractAddress();

  const { data: lastSyncedHeight } = useLastSyncedHeight();

  const userWallet = useUserWallet();

  const variables = useMemo(() => {
    if (
      !userWallet ||
      typeof lastSyncedHeight !== 'number' ||
      lastSyncedHeight === 0
    )
      return undefined;

    return mapVariables({
      Market_contract: moneyMarket.market,
      BorrowerInfoQuery: {
        borrower_info: {
          borrower: userWallet.walletAddress,
          block_height: lastSyncedHeight,
        },
      },
      ANC_token_contract: cw20.ANC,
      MarketStateQuery: {
        state: {},
      },
      UserANCBalanceQuery: {
        balance: {
          address: userWallet.walletAddress,
        },
      },
    });
  }, [cw20.ANC, lastSyncedHeight, moneyMarket.market, userWallet]);

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
    //pollInterval: 1000 * 60 * 10,
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
