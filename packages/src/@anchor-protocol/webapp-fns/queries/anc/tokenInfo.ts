import {
  cw20,
  CW20Addr,
  uANC,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface AncTokenInfoRawData {
  ancTokenInfo: WASMContractResult;
}

export interface AncTokenInfoData {
  ancTokenInfo: cw20.TokenInfoResponse<uANC>;
}

export interface AncTokenInfoRawVariables {
  ancContract: string;
  ancTokenInfoQuery: string;
}

export interface AncTokenInfoVariables {
  ancContract: CW20Addr;
  ancTokenInfoQuery: cw20.TokenInfo;
}

// language=graphql
export const ANC_TOKEN_INFO_QUERY = `
  query (
    $ancContract: String!
    $ancTokenInfoQuery: String!
  ) {
    ancTokenInfo: WasmContractsContractAddressStore(
      ContractAddress: $ancContract
      QueryMsg: $ancTokenInfoQuery
    ) {
      Result
    }
  }
`;

export interface AncTokenInfoQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: AncTokenInfoVariables;
}

export async function ancTokenInfoQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: AncTokenInfoQueryParams): Promise<AncTokenInfoData> {
  const rawData = await mantleFetch<
    AncTokenInfoRawVariables,
    AncTokenInfoRawData
  >(
    ANC_TOKEN_INFO_QUERY,
    {
      ancContract: variables.ancContract,
      ancTokenInfoQuery: JSON.stringify(variables.ancTokenInfoQuery),
    },
    `${mantleEndpoint}?anc--token-info`,
  );

  return {
    ancTokenInfo: JSON.parse(rawData.ancTokenInfo.Result),
  };
}
