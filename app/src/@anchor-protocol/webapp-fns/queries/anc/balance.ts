import { ANC, cw20, CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface AncBalanceWasmQuery {
  ancBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<ANC>>;
}

export type AncBalance = WasmQueryData<AncBalanceWasmQuery>;

export async function ancBalanceQuery(
  walletAddr: HumanAddr | undefined,
  ancTokenAddr: CW20Addr,
  queryClient: QueryClient,
): Promise<AncBalance | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<AncBalanceWasmQuery>({
    ...queryClient,
    id: `anc--balance?address=${walletAddr}`,
    wasmQuery: {
      ancBalance: {
        contractAddress: ancTokenAddr,
        query: {
          balance: {
            address: walletAddr,
          },
        },
      },
    },
  });
}
