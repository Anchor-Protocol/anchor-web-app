import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { Ratio } from '@anchor-protocol/notation';
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  QueryResult,
  useQuery,
} from '@apollo/client';
import big from 'big.js';
import { useAddressProvider } from 'contexts/contract';
import { SAFE_RATIO } from 'env';
import { useMemo } from 'react';
import { Data as MarketBalanceOverviewData } from './marketBalanceOverview';

export interface StringifiedData {
  borrowRate: {
    Result: string;
  };

  oraclePrice: {
    Result: string;
  };

  overseerWhitelist: {
    Result: string;
  };
}

export interface Data {
  borrowRate: {
    rate: Ratio<string>;
  };

  oraclePrice: {
    rate: Ratio<string>;
    last_updated_base: number;
    last_updated_quote: number;
  };

  overseerWhitelist: {
    elems: {
      collateral_token: string;
      custody_contract: string;
      ltv: Ratio<string>;
    }[];
  };

  bLunaMaxLtv: Ratio<string>;
  bLunaSafeLtv: Ratio<string>;
}

export function parseData(
  { borrowRate, oraclePrice, overseerWhitelist }: StringifiedData,
  addressProvider: AddressProvider,
): Data {
  const parsedOverseerWhitelist: Data['overseerWhitelist'] = JSON.parse(
    overseerWhitelist.Result,
  );
  const bLunaMaxLtv = parsedOverseerWhitelist.elems.find(
    ({ collateral_token }) =>
      collateral_token === addressProvider.bAssetToken('ubluna'),
  )?.ltv;

  if (!bLunaMaxLtv) {
    throw new Error(`Undefined bLuna collateral token!`);
  }

  return {
    borrowRate: JSON.parse(borrowRate.Result),
    oraclePrice: JSON.parse(oraclePrice.Result),
    overseerWhitelist: parsedOverseerWhitelist,
    bLunaMaxLtv,
    bLunaSafeLtv: big(bLunaMaxLtv).mul(SAFE_RATIO).toString() as Ratio,
  };
}

export interface StringifiedVariables {
  interestContractAddress: string;
  interestBorrowRateQuery: string;
  oracleContractAddress: string;
  oracleQuery: string;
  overseerContractAddress: string;
  overseerWhitelistQuery: string;
}

export interface Variables {
  interestContractAddress: string;
  interestBorrowRateQuery: {
    borrow_rate: {
      market_balance: string;
      total_liabilities: string;
      total_reserves: string;
    };
  };
  oracleContractAddress: string;
  oracleQuery: {
    price: {
      base: string;
      quote: string;
    };
  };
  overseerContractAddress: string;
  overseerWhitelistQuery: {
    whitelist: {
      collateral_token: string;
    };
  };
}

export function stringifyVariables({
  interestContractAddress,
  interestBorrowRateQuery,
  oracleContractAddress,
  oracleQuery,
  overseerContractAddress,
  overseerWhitelistQuery,
}: Variables): StringifiedVariables {
  return {
    interestContractAddress,
    interestBorrowRateQuery: JSON.stringify(interestBorrowRateQuery),
    oracleContractAddress,
    oracleQuery: JSON.stringify(oracleQuery),
    overseerContractAddress,
    overseerWhitelistQuery: JSON.stringify(overseerWhitelistQuery),
  };
}

export const query = gql`
  query(
    $interestContractAddress: String!
    $interestBorrowRateQuery: String!
    $oracleContractAddress: String!
    $oracleQuery: String!
    $overseerContractAddress: String!
    $overseerWhitelistQuery: String!
  ) {
    borrowRate: WasmContractsContractAddressStore(
      ContractAddress: $interestContractAddress
      QueryMsg: $interestBorrowRateQuery
    ) {
      Result
    }

    oraclePrice: WasmContractsContractAddressStore(
      ContractAddress: $oracleContractAddress
      QueryMsg: $oracleQuery
    ) {
      Result
    }

    overseerWhitelist: WasmContractsContractAddressStore(
      ContractAddress: $overseerContractAddress
      QueryMsg: $overseerWhitelistQuery
    ) {
      Result
    }
  }
`;

export function useMarketOverview({
  marketBalance,
}: {
  marketBalance: MarketBalanceOverviewData | undefined;
}): QueryResult<StringifiedData, StringifiedVariables> & {
  parsedData: Data | undefined;
} {
  const addressProvider = useAddressProvider();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: !marketBalance,
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
      interestContractAddress: addressProvider.interest(),
      interestBorrowRateQuery: {
        borrow_rate: {
          market_balance:
            marketBalance?.marketBalance.find(({ Denom }) => Denom === 'uusd')
              ?.Amount ?? '',
          total_liabilities: marketBalance?.marketState.total_liabilities ?? '',
          total_reserves: marketBalance?.marketState.total_reserves ?? '',
        },
      },
      oracleContractAddress: addressProvider.oracle(),
      oracleQuery: {
        price: {
          base: addressProvider.bAssetToken('ubluna'),
          quote: 'uusd',
        },
      },
      overseerContractAddress: addressProvider.overseer('ubluna'),
      overseerWhitelistQuery: {
        whitelist: {
          collateral_token: addressProvider.bAssetToken('ubluna'),
        },
      },
    }),
  });

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data, addressProvider) : undefined),
    [addressProvider, result.data],
  );

  return {
    ...result,
    parsedData,
  };
}

export function queryMarketOverview(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  marketBalance: MarketBalanceOverviewData,
): Promise<ApolloQueryResult<StringifiedData> & { parsedData: Data }> {
  return client
    .query<StringifiedData, StringifiedVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: stringifyVariables({
        interestContractAddress: addressProvider.interest(),
        interestBorrowRateQuery: {
          borrow_rate: {
            market_balance:
              marketBalance.marketBalance.find(({ Denom }) => Denom === 'uusd')
                ?.Amount ?? '',
            total_liabilities: marketBalance.marketState.total_liabilities,
            total_reserves: marketBalance.marketState.total_reserves,
          },
        },
        oracleContractAddress: addressProvider.oracle(),
        oracleQuery: {
          price: {
            base: addressProvider.bAssetToken('ubluna'),
            quote: 'uusd',
          },
        },
        overseerContractAddress: addressProvider.overseer('ubluna'),
        overseerWhitelistQuery: {
          whitelist: {
            collateral_token: addressProvider.bAssetToken('ubluna'),
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        parsedData: parseData(result.data, addressProvider),
      };
    });
}
