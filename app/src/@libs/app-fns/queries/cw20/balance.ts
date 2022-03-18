import { importCW20Decimals } from '@anchor-protocol/app-fns';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cw20, CW20Addr, HumanAddr, Token } from '@libs/types';
import { cw20TokenInfoQuery } from './tokenInfo';

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
  if (!walletAddr || !tokenAddr) {
    return undefined;
  }

  const { tokenInfo } = await cw20TokenInfoQuery(tokenAddr, queryClient);

  const result = await wasmFetch<CW20BalanceWasmQuery<T>>({
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
  });

  if (tokenInfo.decimals !== 6) {
    return {
      tokenBalance: {
        balance: importCW20Decimals<T>(result.tokenBalance.balance, tokenInfo),
      },
    };
  } else {
    return result;
  }
}
