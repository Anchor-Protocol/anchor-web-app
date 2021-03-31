import { moneyMarket, WASMContractResult } from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  borrowerInfo: WASMContractResult;
  marketState: WASMContractResult;
}

export interface Data {
  borrowerInfo: WASMContractResult<moneyMarket.market.BorrowerInfoResponse>;
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
  BorrowerInfoQuery: moneyMarket.market.BorrowerInfo;
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
  const userWallet = useUserWallet();

  const { moneyMarket } = useContractAddress();

  const variables = useMemo(() => {
    if (!userWallet) return undefined;

    return mapVariables({
      MarketContract: moneyMarket.market,
      BorrowerInfoQuery: {
        borrower_info: {
          borrower: userWallet.walletAddress,
        },
      },
      MarketStateQuery: {
        state: {},
      },
    });
  }, [moneyMarket.market, userWallet]);

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
