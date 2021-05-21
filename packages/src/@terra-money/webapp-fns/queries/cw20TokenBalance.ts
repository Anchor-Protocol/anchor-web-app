import { MantleFetch } from '../types';

export interface CW20TokenBalanceRawData {
  balance: {
    Result: string;
  };
}

export interface CW20TokenBalanceVariables {
  tokenContractAddress: string;
  walletAddress: string;
}

export interface CW20TokenBalanceRawVariables {
  tokenContractAddress: string;
  tokenBalanceQuery: string;
}

// language=graphql
export const CW20_TOKEN_BALANCE_QUERY = `
  query (
    $tokenContractAddress: String!
    $tokenBalanceQuery: String!
  ) {
    balance: WasmContractsContractAddressStore(
      ContractAddress: $tokenContractAddress
      QueryMsg: $tokenBalanceQuery
    ) {
      Result
    }
  }
`;

export interface CW20TokenBalanceQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: CW20TokenBalanceVariables;
}

export async function cw20TokenBalanceQuery<Token extends string>({
  mantleEndpoint,
  mantleFetch,
  variables,
}: CW20TokenBalanceQueryParams): Promise<Token> {
  const { balance } = await mantleFetch<
    CW20TokenBalanceRawVariables,
    CW20TokenBalanceRawData
  >(
    CW20_TOKEN_BALANCE_QUERY,
    {
      tokenContractAddress: variables.tokenContractAddress,
      tokenBalanceQuery: JSON.stringify({
        balance: {
          address: variables.walletAddress,
        },
      }),
    },
    `${mantleEndpoint}?cw20TokenBalance&walletAddress=${variables.walletAddress}&tokenContractAddress=${variables.tokenContractAddress}`,
  );

  try {
    return JSON.parse(balance.Result).balance as Token;
  } catch {
    return '0' as Token;
  }
}
