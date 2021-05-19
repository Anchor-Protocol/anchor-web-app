import {
  HumanAddr,
  moneyMarket,
  StableDenom,
  WASMContractResult,
} from '@anchor-protocol/types';
import { useUserWallet } from '@anchor-protocol/wallet-provider';
import { gql, useQuery } from '@apollo/client';
import { useSubscription } from '@terra-dev/broadcastable-operation';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { useLastSyncedHeight } from 'base/queries/lastSyncedHeight';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  marketBorrowerInfo: WASMContractResult;
  overseerBorrowLimit: WASMContractResult;
  overseerCollaterals: WASMContractResult;
  overseerWhitelist: WASMContractResult;
  oraclePriceInfo: WASMContractResult;
}

export interface Data {
  marketBorrowerInfo: WASMContractResult<moneyMarket.market.BorrowerInfoResponse>;
  overseerBorrowLimit: WASMContractResult<moneyMarket.overseer.BorrowLimitResponse>;
  overseerCollaterals: WASMContractResult<moneyMarket.overseer.CollateralsResponse>;
  overseerWhitelist: WASMContractResult<moneyMarket.overseer.WhitelistResponse>;
  oraclePriceInfo: WASMContractResult<moneyMarket.oracle.PriceResponse>;
}

export const dataMap = createMap<RawData, Data>({
  marketBorrowerInfo: (existing, { marketBorrowerInfo }) =>
    parseResult(existing.marketBorrowerInfo, marketBorrowerInfo.Result),
  overseerBorrowLimit: (existing, { overseerBorrowLimit }) =>
    parseResult(existing.overseerBorrowLimit, overseerBorrowLimit.Result),
  overseerCollaterals: (existing, { overseerCollaterals }) =>
    parseResult(existing.overseerCollaterals, overseerCollaterals.Result),
  overseerWhitelist: (existing, { overseerWhitelist }) =>
    parseResult(existing.overseerWhitelist, overseerWhitelist.Result),
  oraclePriceInfo: (existing, { oraclePriceInfo }) =>
    parseResult(existing.oraclePriceInfo, oraclePriceInfo.Result),
});

export interface RawVariables {
  marketContract: string;
  marketBorrowerInfoQuery: string;
  overseerContract: string;
  overseerBorrowlimitQuery: string;
  overseerCollateralsQuery: string;
  overseerWhitelistQuery: string;
  oracleContract: string;
  oraclePriceQuery: string;
}

export interface Variables {
  marketContract: HumanAddr;
  marketBorrowerInfoQuery: moneyMarket.market.BorrowerInfo;
  overseerContract: HumanAddr;
  overseerBorrowlimitQuery: moneyMarket.overseer.BorrowLimit;
  overseerCollateralsQuery: moneyMarket.overseer.Collaterals;
  overseerWhitelistQuery: moneyMarket.overseer.Whitelist;
  oracleContract: HumanAddr;
  oraclePriceQuery: moneyMarket.oracle.Price;
}

export function mapVariables({
  marketContract,
  marketBorrowerInfoQuery,
  overseerContract,
  overseerBorrowlimitQuery,
  overseerCollateralsQuery,
  overseerWhitelistQuery,
  oracleContract,
  oraclePriceQuery,
}: Variables): RawVariables {
  return {
    marketContract,
    marketBorrowerInfoQuery: JSON.stringify(marketBorrowerInfoQuery),
    overseerContract,
    overseerBorrowlimitQuery: JSON.stringify(overseerBorrowlimitQuery),
    overseerCollateralsQuery: JSON.stringify(overseerCollateralsQuery),
    overseerWhitelistQuery: JSON.stringify(overseerWhitelistQuery),
    oracleContract,
    oraclePriceQuery: JSON.stringify(oraclePriceQuery),
  };
}

export const query = gql`
  query __liquidationPrice(
    $marketContract: String!
    $marketBorrowerInfoQuery: String!
    $overseerContract: String!
    $overseerBorrowlimitQuery: String!
    $overseerCollateralsQuery: String!
    $overseerWhitelistQuery: String!
    $oracleContract: String!
    $oraclePriceQuery: String!
  ) {
    marketBorrowerInfo: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $marketBorrowerInfoQuery
    ) {
      Result
    }

    overseerBorrowLimit: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerBorrowlimitQuery
    ) {
      Result
    }

    overseerCollaterals: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerCollateralsQuery
    ) {
      Result
    }

    overseerWhitelist: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerWhitelistQuery
    ) {
      Result
    }

    oraclePriceInfo: WasmContractsContractAddressStore(
      ContractAddress: $oracleContract
      QueryMsg: $oraclePriceQuery
    ) {
      Result
    }
  }
`;

export function useLiquidationPrice(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const userWallet = useUserWallet();

  const address = useContractAddress();

  const { data: lastSyncedHeight } = useLastSyncedHeight();

  const variables = useMemo(() => {
    if (
      !userWallet ||
      typeof lastSyncedHeight !== 'number' ||
      lastSyncedHeight === 0
    )
      return undefined;

    return mapVariables({
      marketContract: address.moneyMarket.market,
      marketBorrowerInfoQuery: {
        borrower_info: {
          borrower: userWallet.walletAddress,
          block_height: lastSyncedHeight,
        },
      },
      overseerContract: address.moneyMarket.overseer,
      overseerBorrowlimitQuery: {
        borrow_limit: {
          borrower: userWallet.walletAddress,
          block_time: lastSyncedHeight,
        },
      },
      overseerCollateralsQuery: {
        collaterals: {
          borrower: userWallet.walletAddress,
          //block_height: lastSyncedHeight,
        },
      },
      overseerWhitelistQuery: {
        whitelist: {
          collateral_token: address.cw20.bLuna,
        },
      },
      oracleContract: address.moneyMarket.oracle,
      oraclePriceQuery: {
        price: {
          base: address.cw20.bLuna,
          quote: 'uusd' as StableDenom,
        },
      },
    });
  }, [
    address.cw20.bLuna,
    address.moneyMarket.market,
    address.moneyMarket.oracle,
    address.moneyMarket.overseer,
    lastSyncedHeight,
    userWallet,
  ]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 60 * 10,
    variables,
    onError,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
