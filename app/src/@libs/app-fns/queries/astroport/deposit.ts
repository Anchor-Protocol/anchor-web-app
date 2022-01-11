import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { CW20Addr, HumanAddr, Token } from '@libs/types';
import { astroport } from '@libs/types/contracts/astroport';

interface AstroportDepositQuery<T extends Token> {
  deposit: WasmQuery<
    astroport.QueryMsg.Deposit,
    astroport.QueryMsg.DepositResponse<T>
  >;
}

export type AstroportDeposit<T extends Token> = WasmQueryData<
  AstroportDepositQuery<T>
>;

export async function astroportDepositQuery<T extends Token>(
  walletAddr: HumanAddr | undefined,
  lpTokenAddr: CW20Addr,
  generatorAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<AstroportDeposit<T> | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  const result = await wasmFetch<AstroportDepositQuery<T>>({
    ...queryClient,
    id: `astroport--deposit=${walletAddr}&lp=${lpTokenAddr}`,
    wasmQuery: {
      deposit: {
        contractAddress: generatorAddr,
        query: {
          deposit: {
            lp_token: lpTokenAddr,
            user: walletAddr,
          },
        },
      },
    },
  });

  return result;
}
