import {
  cw20,
  CW20Addr,
  uANC,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface AncBalanceRawData {
  ancBalance: WASMContractResult;
}

export interface AncBalanceData {
  ancBalance: cw20.BalanceResponse<uANC>;
}

export interface AncBalanceRawVariables {
  ancContract: string;
  balanceQuery: string;
}

export interface AncBalanceVariables {
  ancContract: CW20Addr;
  balanceQuery: cw20.Balance;
}

// language=graphql
export const ANC_BALANCE_QUERY = `
  query (
    $ancContract: String!
    $balanceQuery: String!
  ) {
    ancBalance: WasmContractsContractAddressStore(
      ContractAddress: $ancContract
      QueryMsg: $balanceQuery
    ) {
      Result
    }
  }
`;

export interface AncBalanceQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: AncBalanceVariables;
}

export async function ancBalanceQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: AncBalanceQueryParams): Promise<AncBalanceData> {
  const rawData = await mantleFetch<AncBalanceRawVariables, AncBalanceRawData>(
    ANC_BALANCE_QUERY,
    {
      ancContract: variables.ancContract,
      balanceQuery: JSON.stringify(variables.balanceQuery),
    },
    `${mantleEndpoint}?anc--balance?address=${variables.balanceQuery.balance.address}`,
  );

  return {
    ancBalance: JSON.parse(rawData.ancBalance.Result),
  };
}
