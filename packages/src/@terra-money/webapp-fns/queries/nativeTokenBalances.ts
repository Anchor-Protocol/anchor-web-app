import { MantleFetch } from '../types';

export interface NativeTokenBalancesRawData {
  bankBalances: {
    Result: { Denom: string; Amount: string }[];
  };
}

export type NativeTokenBalancesData = Record<string, string>;

export interface NativeTokenBalancesVariables {
  walletAddress: string;
}

// language=graphql
export const NATIVE_TOKEN_BALANCES_QUERY = `
  query (
    $walletAddress: String!
  ) {
    bankBalances: BankBalancesAddress(Address: $walletAddress) {
      Result {
        Denom
        Amount
      }
    }
  }
`;

export interface NativeTokenBalancesQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: NativeTokenBalancesVariables;
}

export async function nativeTokenBalancesQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: NativeTokenBalancesQueryParams): Promise<NativeTokenBalancesData> {
  const { bankBalances } = await mantleFetch<
    NativeTokenBalancesVariables,
    NativeTokenBalancesRawData
  >(
    NATIVE_TOKEN_BALANCES_QUERY,
    variables,
    `${mantleEndpoint}?nativeTokenBalances`,
  );

  const nativeTokenBalances: Record<string, string> = {};

  for (const { Denom, Amount } of bankBalances.Result) {
    nativeTokenBalances[Denom] = Amount;
  }

  return nativeTokenBalances;
}
