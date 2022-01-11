import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { CW20Addr, HumanAddr, Token } from '@libs/types';
import { astroport } from '@libs/types/contracts/astroport';

interface AstroportPendingTokenQuery<T extends Token> {
  pendingToken: WasmQuery<
    astroport.QueryMsg.PendingToken,
    astroport.QueryMsg.PendingTokenResponse<T>
  >;
}

export type AstroportPendingToken<T extends Token> = WasmQueryData<
  AstroportPendingTokenQuery<T>
>;

export async function astroportPendingTokenQuery<T extends Token>(
  walletAddr: HumanAddr | undefined,
  lpTokenAddr: CW20Addr,
  generatorAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<AstroportPendingToken<T> | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  const result = await wasmFetch<AstroportPendingTokenQuery<T>>({
    ...queryClient,
    id: `astroport--pending-token=${walletAddr}&lp=${lpTokenAddr}`,
    wasmQuery: {
      pendingToken: {
        contractAddress: generatorAddr,
        query: {
          pending_token: {
            lp_token: lpTokenAddr,
            user: walletAddr,
          },
        },
      },
    },
  });

  return result;
}
