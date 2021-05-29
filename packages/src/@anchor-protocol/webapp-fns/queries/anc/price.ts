import {
  HumanAddr,
  terraswap,
  uANC,
  uAncUstLP,
  UST,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

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

  return {
    ancPrice: JSON.parse(rawData.ancPrice.Result),
  };
}
