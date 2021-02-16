import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { Num, uUST } from '@anchor-protocol/notation';
import { createMap, map, Mapped, useMap } from '@anchor-protocol/use-map';
import { WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient, gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedApolloQueryResult, MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';
import { Data as MarketState } from './marketState';

export interface RawData {
  loanAmount: {
    Result: string;
  };

  liability: {
    Result: string;
  };

  borrowInfo: {
    Result: string;
  };
}

export interface Data {
  loanAmount: {
    Result: string;
    borrower: string;
    loan_amount: uUST<string>;
  };

  liability: {
    Result: string;
    borrower: string;
    loan_amount: uUST<string>;
    interest_index: Num<string>;
  };

  borrowInfo: {
    Result: string;
    borrower: string;
    balance: uUST<string>;
    spendable: uUST<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  loanAmount: (existing, { loanAmount }) => {
    return parseResult(existing.loanAmount, loanAmount.Result);
  },
  liability: (existing, { liability }) => {
    return parseResult(existing.liability, liability.Result);
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
    borrower: '',
  },

  liability: {
    Result: '',
    loan_amount: '0' as uUST,
    borrower: '',
    interest_index: '1' as Num,
  },

  borrowInfo: {
    Result: '',
    borrower: '',
    balance: '0' as uUST,
    spendable: '0' as uUST,
  },
};

export interface RawVariables {
  marketContractAddress: string;
  marketLoanQuery: string;
  marketLiabilityQuery: string;
  custodyContractAddress: string;
  custodyBorrowerQuery: string;
}

export interface Variables {
  marketContractAddress: string;
  marketLoanQuery: {
    loan_amount: {
      borrower: string;
      block_height: number;
    };
  };
  custodyContractAddress: string;
  custodyBorrowerQuery: {
    borrower: {
      address: string;
    };
  };
}

export function mapVariables({
  marketContractAddress,
  marketLoanQuery,
  custodyContractAddress,
  custodyBorrowerQuery,
}: Variables): RawVariables {
  return {
    marketContractAddress,
    marketLoanQuery: JSON.stringify(marketLoanQuery),
    marketLiabilityQuery: JSON.stringify({
      liability: {
        borrower: marketLoanQuery.loan_amount.borrower,
      },
    }),
    custodyContractAddress,
    custodyBorrowerQuery: JSON.stringify(custodyBorrowerQuery),
  };
}

export const query = gql`
  query __marketUserOverview(
    $marketContractAddress: String!
    $marketLoanQuery: String!
    $marketLiabilityQuery: String!
    $custodyContractAddress: String!
    $custodyBorrowerQuery: String!
  ) {
    loanAmount: WasmContractsContractAddressStore(
      ContractAddress: $marketContractAddress
      QueryMsg: $marketLoanQuery
    ) {
      Result
    }

    liability: WasmContractsContractAddressStore(
      ContractAddress: $marketContractAddress
      QueryMsg: $marketLiabilityQuery
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
  const addressProvider = useAddressProvider();

  const { serviceAvailable, walletReady } = useService();

  const variables = useMemo(() => {
    return mapVariables({
      marketContractAddress: addressProvider.market('uusd'),
      marketLoanQuery: {
        loan_amount: {
          borrower: walletReady?.walletAddress ?? '',
          block_height: currentBlock ?? 0,
        },
      },
      custodyContractAddress: addressProvider.custody('ubluna'),
      custodyBorrowerQuery: {
        borrower: {
          address: walletReady?.walletAddress ?? '',
        },
      },
    });
  }, [addressProvider, currentBlock, walletReady?.walletAddress]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable || typeof currentBlock !== 'number',
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data: serviceAvailable ? data : mockupData,
    refetch,
  };
}

export function queryMarketUserOverview(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  walletStatus: WalletStatus,
  currentBlock: MarketState['currentBlock'],
): Promise<MappedApolloQueryResult<RawData, Data>> {
  if (walletStatus.status !== 'ready') {
    throw new Error(`Wallet is not ready`);
  }

  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        marketContractAddress: addressProvider.market('uusd'),
        marketLoanQuery: {
          loan_amount: {
            borrower: walletStatus.walletAddress,
            block_height: currentBlock,
          },
        },
        custodyContractAddress: addressProvider.custody('ubluna'),
        custodyBorrowerQuery: {
          borrower: {
            address: walletStatus.walletAddress,
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
