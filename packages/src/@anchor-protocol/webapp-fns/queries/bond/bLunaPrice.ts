import {
  bLuna,
  HumanAddr,
  terraswap,
  uToken,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';
import big from 'big.js';

export interface BondBLunaPriceRawData {
  terraswapPool: WASMContractResult;
}

export interface BondBLunaPriceData {
  terraswapPool: terraswap.PoolResponse<uToken>;
  bLunaPrice: bLuna;
}

export interface BondBLunaPriceRawVariables {
  terraswapContract: string;
  terraswapPoolQuery: string;
}

export interface BondBLunaPriceVariables {
  terraswapContract: HumanAddr;
  terraswapPoolQuery: terraswap.Pool;
}

// language=graphql
export const BOND_BLUNA_PRICE_QUERY = `
  query (
    $terraswapContract: String!
    $terraswapPoolQuery: String!
  ) {
    terraswapPool: WasmContractsContractAddressStore(
      ContractAddress: $terraswapContract
      QueryMsg: $terraswapPoolQuery
    ) {
      Result
    }
  }
`;

export interface BondBLunaPriceQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BondBLunaPriceVariables;
}

export async function bondBLunaPriceQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BondBLunaPriceQueryParams): Promise<BondBLunaPriceData> {
  const rawData = await mantleFetch<
    BondBLunaPriceRawVariables,
    BondBLunaPriceRawData
  >(
    BOND_BLUNA_PRICE_QUERY,
    {
      terraswapContract: variables.terraswapContract,
      terraswapPoolQuery: JSON.stringify(variables.terraswapPoolQuery),
    },
    `${mantleEndpoint}?bond--bluna-price`,
  );

  const terraswapPool: terraswap.PoolResponse<uToken> = JSON.parse(
    rawData.terraswapPool.Result,
  );

  return {
    terraswapPool,
    bLunaPrice: big(terraswapPool.assets[0].amount)
      .div(
        +terraswapPool.assets[1].amount === 0
          ? 1
          : terraswapPool.assets[1].amount,
      )
      .toFixed() as bLuna,
  };
}
