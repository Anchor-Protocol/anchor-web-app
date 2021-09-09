import { ANC, cw20, CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';

interface AncBalanceWasmQuery {
  ancBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<ANC>>;
}

export type AncBalance = WasmQueryData<AncBalanceWasmQuery>;

export async function ancBalanceQuery(
  ancTokenAddr: CW20Addr,
  walletAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<AncBalance> {
  return mantle<AncBalanceWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?anc--balance?address=${walletAddr}`,
    mantleFetch,
    requestInit,
    variables: {},
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
