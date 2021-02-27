import type { Num, Rate, uaUST, uUST } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  borrowerInfo: {
    Result: string;
  };

  marketState: {
    Result: string;
  };
}

export interface Data {
  borrowerInfo: {
    Result: string;
    borrower: string;
    interest_index: Num<string>;
    loan_amount: uUST<string>;
    pending_rewards: Num<string>;
    reward_index: Num<string>;
  };

  marketState: {
    Result: string;
    anc_emission_rate: Rate<string>;
    global_interest_index: Num<string>;
    global_reward_index: Num<string>;
    last_interest_updated: number;
    last_reward_updated: number;
    total_liabilities: uUST<string>;
    total_reserves: uaUST<string>;
  };
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
  userWalletAddress: string;
}

export function mapVariables({
  MarketContract,
  userWalletAddress,
}: Variables): RawVariables {
  return {
    MarketContract,
    BorrowerInfoQuery: JSON.stringify({
      borrower_info: { borrower: userWalletAddress },
    }),
    MarketStateQuery: JSON.stringify({
      state: {},
    }),
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
    return mapVariables({
      MarketContract: moneyMarket.market,
      userWalletAddress: walletReady?.walletAddress ?? '',
    });
  }, [moneyMarket.market, walletReady?.walletAddress]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable,
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
