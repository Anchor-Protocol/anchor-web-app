import type { uANC } from '@anchor-protocol/types';
import { cw20, moneyMarket, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { useLastSyncedHeight } from 'queries/lastSyncedHeight';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  borrowerInfo: WASMContractResult;
  userANCBalance: WASMContractResult;
  marketState: WASMContractResult;
}

export interface Data {
  borrowerInfo: WASMContractResult<moneyMarket.market.BorrowInfoResponse>;
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
  BorrowerInfoQuery: moneyMarket.market.BorrowInfo;
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

  const { serviceAvailable, walletReady } = useService();

  const variables = useMemo(() => {
    if (!walletReady) return undefined;

    return mapVariables({
      Market_contract: moneyMarket.market,
      BorrowerInfoQuery: {
        borrower_info: {
          borrower: walletReady.walletAddress,
          block_height: lastSyncedHeight,
        },
      },
      ANC_token_contract: cw20.ANC,
      MarketStateQuery: {
        state: {},
      },
      UserANCBalanceQuery: {
        balance: {
          address: walletReady.walletAddress,
        },
      },
    });
  }, [cw20.ANC, lastSyncedHeight, moneyMarket.market, walletReady]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !variables || !serviceAvailable,
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
