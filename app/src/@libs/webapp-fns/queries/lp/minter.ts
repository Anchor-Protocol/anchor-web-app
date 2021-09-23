import { lp, LPAddr } from '@libs/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';

interface LpMinterWasmQuery {
  minter: WasmQuery<lp.Minter, lp.MinterResponse>;
}

export type LpMinter = WasmQueryData<LpMinterWasmQuery>;

export async function lpMinterQuery(
  lpTokenAddr: LPAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<LpMinter> {
  return mantle<LpMinterWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?lp--minter=${lpTokenAddr}`,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      minter: {
        contractAddress: lpTokenAddr,
        query: {
          minter: {},
        },
      },
    },
  });
}
