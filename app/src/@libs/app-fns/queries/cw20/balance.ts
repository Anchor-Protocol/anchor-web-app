import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cw20, CW20Addr, HumanAddr, Token } from '@libs/types';

interface CW20BalanceWasmQuery<T extends Token> {
  tokenBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<T>>;
}

export type CW20Balance<T extends Token> = WasmQueryData<
  CW20BalanceWasmQuery<T>
>;

export async function cw20BalanceQuery<T extends Token>(
  walletAddr: HumanAddr | undefined,
  tokenAddr: CW20Addr | undefined,
  queryClient: QueryClient,
): Promise<CW20Balance<T> | undefined> {
  return walletAddr && tokenAddr
    ? wasmFetch<CW20BalanceWasmQuery<T>>({
        ...queryClient,
        id: `cw20--balance=${tokenAddr}`,
        wasmQuery: {
          tokenBalance: {
            contractAddress: tokenAddr,
            query: {
              balance: {
                address: walletAddr,
              },
            },
          },
        },
      })
    : Promise.resolve(undefined);
}
