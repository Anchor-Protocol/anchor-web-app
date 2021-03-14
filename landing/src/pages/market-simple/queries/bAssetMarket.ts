import {
  HumanAddr,
  moneyMarket,
  StableDenom,
  ubLuna,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface RawData {
  ubLunaBalance: WASMContractResult;
  oraclePrice: WASMContractResult;
}

export interface Data {
  ubLuna: ubLuna;
  oraclePrice: WASMContractResult<moneyMarket.oracle.PriceResponse>;
}

export const dataMap = createMap<RawData, Data>({
  ubLuna: (_, { ubLunaBalance }) => {
    return JSON.parse(ubLunaBalance.Result).balance as ubLuna;
  },
  oraclePrice: (existing, { oraclePrice }) => {
    return parseResult(existing.oraclePrice, oraclePrice.Result);
  },
});

export interface RawVariables {
  bAssetTokenAddress: string;
  bAssetTokenBalanceQuery: string;
  oracleContractAddress: string;
  oracleQuery: string;
}

export interface Variables {
  walletAddress: string;
  bAssetTokenAddress: string;
  oracleContractAddress: HumanAddr;
  oracleQuery: moneyMarket.oracle.Price;
}

export function mapVariables({
  walletAddress,
  bAssetTokenAddress,
  oracleContractAddress,
  oracleQuery,
}: Variables): RawVariables {
  return {
    bAssetTokenAddress,
    bAssetTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    oracleContractAddress,
    oracleQuery: JSON.stringify(oracleQuery),
  };
}

export const query = gql`
  query __bAssetMarket(
    $bAssetTokenAddress: String!
    $bAssetTokenBalanceQuery: String!
    $oracleContractAddress: String!
    $oracleQuery: String!
  ) {
    ubLunaBalance: WasmContractsContractAddressStore(
      ContractAddress: $bAssetTokenAddress
      QueryMsg: $bAssetTokenBalanceQuery
    ) {
      Result
    }
    oraclePrice: WasmContractsContractAddressStore(
      ContractAddress: $oracleContractAddress
      QueryMsg: $oracleQuery
    ) {
      Result
    }
  }
`;

export function useBAssetMarket(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const address = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      bAssetTokenAddress: address.cw20.bLuna,
      walletAddress: address.moneyMarket.custody,
      oracleContractAddress: address.moneyMarket.oracle,
      oracleQuery: {
        price: {
          base: address.cw20.bLuna,
          quote: 'uusd' as StableDenom,
        },
      },
    });
  }, [
    address.cw20.bLuna,
    address.moneyMarket.custody,
    address.moneyMarket.oracle,
  ]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 60,
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
