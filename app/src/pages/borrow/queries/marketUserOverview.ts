import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { Num, uUST } from '@anchor-protocol/notation';
import { useMap } from '@anchor-protocol/use-map';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  QueryResult,
  useQuery,
} from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { Data as MarketBalanceOverviewData } from './marketBalanceOverview';

export interface StringifiedData {
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
    borrower: string;
    loan_amount: uUST<string>;
  };

  liability: {
    borrower: string;
    loan_amount: uUST<string>;
    interest_index: Num<string>;
  };

  borrowInfo: {
    borrower: string;
    balance: uUST<string>;
    spendable: uUST<string>;
  };
}

export function parseData({
  loanAmount,
  liability,
  borrowInfo,
}: StringifiedData): Data {
  return {
    loanAmount: JSON.parse(loanAmount.Result),
    liability: JSON.parse(liability.Result),
    borrowInfo: JSON.parse(borrowInfo.Result),
  };
}

export interface StringifiedVariables {
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

export function stringifyVariables({
  marketContractAddress,
  marketLoanQuery,
  custodyContractAddress,
  custodyBorrowerQuery,
}: Variables): StringifiedVariables {
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
  query(
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
  marketBalance,
}: {
  marketBalance: MarketBalanceOverviewData | undefined;
}): QueryResult<StringifiedData, StringifiedVariables> & {
  parsedData: Data | undefined;
} {
  const addressProvider = useAddressProvider();
  const { status } = useWallet();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: status.status !== 'ready' || !marketBalance,
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
      marketContractAddress: addressProvider.market('uusd'),
      marketLoanQuery: {
        loan_amount: {
          borrower: status.status === 'ready' ? status.walletAddress : '',
          block_height: marketBalance?.currentBlock ?? 0,
        },
      },
      custodyContractAddress: addressProvider.custody('ubluna'),
      custodyBorrowerQuery: {
        borrower: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
    }),
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      result.refetch();
    }
  });

  const parsedData = useMap<StringifiedData | undefined, Data>(
    result.data,
    (next, prev) => {
      return !!next ? parseData(next) : prev;
    },
  );

  return {
    ...result,
    parsedData,
  };
}

export function queryMarketUserOverview(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  walletStatus: WalletStatus,
  marketBalance: MarketBalanceOverviewData,
): Promise<ApolloQueryResult<StringifiedData> & { parsedData: Data }> {
  if (walletStatus.status !== 'ready') {
    throw new Error(`Wallet is not ready`);
  }

  return client
    .query<StringifiedData, StringifiedVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: stringifyVariables({
        marketContractAddress: addressProvider.market('uusd'),
        marketLoanQuery: {
          loan_amount: {
            borrower: walletStatus.walletAddress,
            block_height: marketBalance.currentBlock,
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
        parsedData: parseData(result.data),
      };
    });
}
