import {
  HumanAddr,
  terraswap,
  uANC,
  uAncUstLP,
  UST,
  uToken,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';
import big from 'big.js';

export interface AncPrice {
  ANCPoolSize: uANC;
  USTPoolSize: uUST;
  LPShare: uAncUstLP;
  ANCPrice: UST;
}

export interface AncPriceRawData {
  ancPrice: WASMContractResult;
}

export interface AncPriceData {
  ancPrice: AncPrice;
}

export interface AncPriceRawVariables {
  ancUstPairContract: string;
  poolInfoQuery: string;
}

export interface AncPriceVariables {
  ancUstPairContract: HumanAddr;
  poolInfoQuery: terraswap.Pool;
}

// language=graphql
export const ANC_PRICE_QUERY = `
  query ($ancUstPairContract: String!, $poolInfoQuery: String!) {
    ancPrice: WasmContractsContractAddressStore(
      ContractAddress: $ancUstPairContract
      QueryMsg: $poolInfoQuery
    ) {
      Result
    }
  }
`;

export interface AncPriceQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: AncPriceVariables;
}

export async function ancPriceQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: AncPriceQueryParams): Promise<AncPriceData> {
  const rawData = await mantleFetch<AncPriceRawVariables, AncPriceRawData>(
    ANC_PRICE_QUERY,
    {
      ancUstPairContract: variables.ancUstPairContract,
      poolInfoQuery: JSON.stringify(variables.poolInfoQuery),
    },
    `${mantleEndpoint}?anc--price`,
  );

  const { assets, total_share }: terraswap.PoolResponse<uToken> = JSON.parse(
    rawData.ancPrice.Result,
  );

  const ANCPoolSize = (assets[0].amount as unknown) as uANC;
  const USTPoolSize = (assets[1].amount as unknown) as uUST;
  const LPShare = (total_share as unknown) as uAncUstLP;
  const ANCPrice = big(USTPoolSize)
    .div(+ANCPoolSize === 0 ? '1' : ANCPoolSize)
    .toString() as UST;

  return {
    ancPrice: {
      ANCPoolSize,
      USTPoolSize,
      LPShare,
      ANCPrice: ANCPrice.toLowerCase() === 'nan' ? ('0' as UST) : ANCPrice,
    },
  };
}
