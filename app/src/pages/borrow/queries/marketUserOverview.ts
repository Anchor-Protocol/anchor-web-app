import type {
  HumanAddr,
  moneyMarket,
  Num,
  uANC,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { ContractAddress } from '@anchor-protocol/types';
import { useConnectedWallet } from '@anchor-protocol/wallet-provider2';
import { ApolloClient, gql, useQuery } from '@apollo/client';
import { createMap, map, Mapped, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedApolloQueryResult, MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';
import { Data as MarketState } from './marketState';

export interface RawData {
  loanAmount: WASMContractResult;
  borrowInfo: WASMContractResult;
}

export interface Data {
  loanAmount: WASMContractResult<moneyMarket.market.BorrowerInfoResponse>;
  borrowInfo: WASMContractResult<moneyMarket.custody.BorrowerResponse>;
}

export const dataMap = createMap<RawData, Data>({
  loanAmount: (existing, { loanAmount }) => {
    return parseResult(existing.loanAmount, loanAmount.Result);
  },
  borrowInfo: (existing, { borrowInfo }) => {
    return parseResult(existing.borrowInfo, borrowInfo.Result);
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: undefined,

  loanAmount: {
    Result: '',
    loan_amount: '0' as uUST,
    borrower: '' as HumanAddr,
    interest_index: '1' as Num,
    reward_index: '0' as Num,
    pending_rewards: '0' as uANC,
  },

  borrowInfo: {
    Result: '',
    borrower: '' as HumanAddr,
    balance: '0' as uUST,
    spendable: '0' as uUST,
  },
};

export interface RawVariables {
  marketContractAddress: string;
  marketBorrowerQuery: string;
  custodyContractAddress: string;
  custodyBorrowerQuery: string;
}

export interface Variables {
  marketContractAddress: HumanAddr;
  marketBorrowerQuery: moneyMarket.market.BorrowerInfo;
  custodyContractAddress: HumanAddr;
  custodyBorrowerQuery: moneyMarket.custody.Borrower;
}

export function mapVariables({
  marketContractAddress,
  marketBorrowerQuery,
  custodyContractAddress,
  custodyBorrowerQuery,
}: Variables): RawVariables {
  return {
    marketContractAddress,
    marketBorrowerQuery: JSON.stringify(marketBorrowerQuery),
    custodyContractAddress,
    custodyBorrowerQuery: JSON.stringify(custodyBorrowerQuery),
  };
}

export const query = gql`
  query __marketUserOverview(
    $marketContractAddress: String!
    $marketBorrowerQuery: String!
    $custodyContractAddress: String!
    $custodyBorrowerQuery: String!
  ) {
    loanAmount: WasmContractsContractAddressStore(
      ContractAddress: $marketContractAddress
      QueryMsg: $marketBorrowerQuery
    ) {
      Result
    }

    borrowInfo: WasmContractsContractAddressStore(
      ContractAddress: $custodyContractAddress
      QueryMsg: $custodyBorrowerQuery
    ) {
      Result
    }
  }
`;

export function useMarketUserOverview({
  currentBlock,
}: {
  currentBlock: MarketState['currentBlock'] | undefined;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const { moneyMarket } = useContractAddress();

  const userWallet = useConnectedWallet();

  const variables = useMemo(() => {
    if (!userWallet || typeof currentBlock !== 'number') return undefined;

    return mapVariables({
      marketContractAddress: moneyMarket.market,
      marketBorrowerQuery: {
        borrower_info: {
          borrower: userWallet.walletAddress,
          block_height: currentBlock,
        },
      },
      custodyContractAddress: moneyMarket.custody,
      custodyBorrowerQuery: {
        borrower: {
          address: userWallet.walletAddress,
        },
      },
    });
  }, [currentBlock, moneyMarket.custody, moneyMarket.market, userWallet]);

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
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data: userWallet ? data : mockupData,
    refetch,
  };
}

export function queryMarketUserOverview(
  client: ApolloClient<any>,
  address: ContractAddress,
  walletAddress: HumanAddr,
  currentBlock: MarketState['currentBlock'],
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        marketContractAddress: address.moneyMarket.market,
        marketBorrowerQuery: {
          borrower_info: {
            borrower: walletAddress,
            block_height: currentBlock,
          },
        },
        custodyContractAddress: address.moneyMarket.custody,
        custodyBorrowerQuery: {
          borrower: {
            address: walletAddress,
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        data: map(result.data, dataMap),
      };
    });
}
