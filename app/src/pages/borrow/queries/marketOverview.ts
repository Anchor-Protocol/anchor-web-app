import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { Ratio } from '@anchor-protocol/notation';
import { createMap, map, useMap } from '@anchor-protocol/use-map';
import { ApolloClient, gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { parseResult } from 'queries/parseResult';
import { MappedApolloQueryResult, MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';
import { Data as MarketBalanceOverviewData } from './marketBalanceOverview';

export interface RawData {
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
    Result: string;
    rate: Ratio<string>;
  };

  oraclePrice: {
    Result: string;
    rate: Ratio<string>;
    last_updated_base: number;
    last_updated_quote: number;
  };

  overseerWhitelist: {
    Result: string;

    elems: {
      collateral_token: string;
      custody_contract: string;
      ltv: Ratio<string>;
    }[];

    //bLunaMaxLtv: Ratio<string>;
    //bLunaSafeLtv: Ratio<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  borrowRate: (existing, { borrowRate }) => {
    return parseResult(existing.borrowRate, borrowRate.Result);
  },
  oraclePrice: (existing, { oraclePrice }) => {
    return parseResult(existing.oraclePrice, oraclePrice.Result);
  },
  overseerWhitelist: (existing, { overseerWhitelist }) => {
    return parseResult(existing.overseerWhitelist, overseerWhitelist.Result);

    //  if (existing.overseerWhitelist?.Result === overseerWhitelist.Result) {
    //    return existing.overseerWhitelist;
    //  }
    //
    //  const {Result, elems} = JSON.parse(overseerWhitelist.Result) as Pick<Data['overseerWhitelist'], 'Result' | 'elems'>;
    //
    //  const bLunaMaxLtv = elems.find(
    //  ({ collateral_token }) =>
    //    collateral_token === addressProvider.bAssetToken('ubluna'),
    //)?.ltv;
    //
    //if (!bLunaMaxLtv) {
    //  throw new Error(`Undefined bLuna collateral token!`);
    //}
  },
});

//export function mapData(
//  existing: Data,
//  { borrowRate, oraclePrice, overseerWhitelist }: RawData,
//  addressProvider: AddressProvider,
//): Data {
//  const parsedOverseerWhitelist: Data['overseerWhitelist'] = JSON.parse(
//    overseerWhitelist.Result,
//  );
//  const bLunaMaxLtv = parsedOverseerWhitelist.elems.find(
//    ({ collateral_token }) =>
//      collateral_token === addressProvider.bAssetToken('ubluna'),
//  )?.ltv;
//
//  if (!bLunaMaxLtv) {
//    throw new Error(`Undefined bLuna collateral token!`);
//  }
//
//  return {
//    borrowRate: JSON.parse(borrowRate.Result),
//    oraclePrice: JSON.parse(oraclePrice.Result),
//    overseerWhitelist: parsedOverseerWhitelist,
//    bLunaMaxLtv,
//    bLunaSafeLtv: big(bLunaMaxLtv).mul(SAFE_RATIO).toString() as Ratio,
//  };
//}

export interface RawVariables {
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

export function mapVariables({
  interestContractAddress,
  interestBorrowRateQuery,
  oracleContractAddress,
  oracleQuery,
  overseerContractAddress,
  overseerWhitelistQuery,
}: Variables): RawVariables {
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
  marketState,
}: {
  marketBalance: MarketBalanceOverviewData['marketBalance'] | undefined;
  marketState: MarketBalanceOverviewData['marketState'] | undefined;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      interestContractAddress: addressProvider.interest(),
      interestBorrowRateQuery: {
        borrow_rate: {
          market_balance:
            marketBalance?.find(({ Denom }) => Denom === 'uusd')?.Amount ?? '',
          total_liabilities: marketState?.total_liabilities ?? '',
          total_reserves: marketState?.total_reserves ?? '',
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
    });
  }, [
    addressProvider,
    marketBalance,
    marketState?.total_liabilities,
    marketState?.total_reserves,
  ]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !marketBalance,
    fetchPolicy: 'network-only',
    variables,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}

export function queryMarketOverview(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  marketBalance: MarketBalanceOverviewData['marketBalance'],
  marketState: MarketBalanceOverviewData['marketState'],
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        interestContractAddress: addressProvider.interest(),
        interestBorrowRateQuery: {
          borrow_rate: {
            market_balance:
              marketBalance.find(({ Denom }) => Denom === 'uusd')?.Amount ?? '',
            total_liabilities: marketState.total_liabilities,
            total_reserves: marketState.total_reserves,
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
        data: map(result.data, dataMap),
        //parsedData: mapData(result.data, addressProvider),
      };
    });
}
