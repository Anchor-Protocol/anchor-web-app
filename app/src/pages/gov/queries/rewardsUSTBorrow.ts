import { moneyMarket, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import { MappedQueryResult } from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  borrowerInfo: WASMContractResult;
  marketState: WASMContractResult;
}

export interface Data {
  borrowerInfo: WASMContractResult<moneyMarket.market.BorrowInfoResponse>;
  marketState: WASMContractResult<moneyMarket.market.StateResponse>;
}

export const dataMap = createMap<RawData, Data>({
  borrowerInfo: (existing, { borrowerInfo }) => {
    return parseResult(existing.borrowerInfo, borrowerInfo.Result);
  },

  marketState: (existing, { marketState }) => {
    return parseResult(existing.marketState, marketState.Result);
  },
});

export interface RawVariables {
  MarketContract: string;
  BorrowerInfoQuery: string;
  MarketStateQuery: string;
}

export interface Variables {
  MarketContract: string;
  BorrowerInfoQuery: moneyMarket.market.BorrowInfo;
  MarketStateQuery: moneyMarket.market.State;
}

export function mapVariables({
  MarketContract,
  BorrowerInfoQuery,
  MarketStateQuery,
}: Variables): RawVariables {
  return {
    MarketContract,
    BorrowerInfoQuery: JSON.stringify(BorrowerInfoQuery),
    MarketStateQuery: JSON.stringify(MarketStateQuery),
  };
}

export const query = gql`
  query __rewardsUSTBorrow(
    $MarketContract: String!
    $BorrowerInfoQuery: String!
    $MarketStateQuery: String!
  ) {
    borrowerInfo: WasmContractsContractAddressStore(
      ContractAddress: $MarketContract
      QueryMsg: $BorrowerInfoQuery
    ) {
      Result
    }

    marketState: WasmContractsContractAddressStore(
      ContractAddress: $MarketContract
      QueryMsg: $MarketStateQuery
    ) {
      Result
    }
  }
`;

export function useRewardsUSTBorrow(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable, walletReady } = useService();

  const { moneyMarket } = useContractAddress();

  const variables = useMemo(() => {
    if (!walletReady) return undefined;

    return mapVariables({
      MarketContract: moneyMarket.market,
      BorrowerInfoQuery: {
        borrower_info: {
          borrower: walletReady.walletAddress,
        },
      },
      MarketStateQuery: {
        state: {},
      },
    });
  }, [moneyMarket.market, walletReady]);

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
