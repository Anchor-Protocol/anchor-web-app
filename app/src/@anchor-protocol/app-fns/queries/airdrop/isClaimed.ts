import { bluna, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface AirdropIsClaimedWasmQuery {
  isClaimed: WasmQuery<
    bluna.airdropRegistry.IsClaimed,
    bluna.airdropRegistry.IsClaimedResponse
  >;
}

export type AirdropIsClaimed = WasmQueryData<AirdropIsClaimedWasmQuery>;

export async function airdropIsClaimedQuery(
  airdropAddr: HumanAddr,
  walletAddr: HumanAddr,
  airdropStage: number,
  queryClient: QueryClient,
): Promise<AirdropIsClaimed> {
  return wasmFetch<AirdropIsClaimedWasmQuery>({
    ...queryClient,
    id: `airdrop--is-claimed&address=${walletAddr}&stage=${airdropStage}`,
    wasmQuery: {
      isClaimed: {
        contractAddress: airdropAddr,
        query: {
          is_claimed: {
            address: walletAddr,
            stage: airdropStage,
          },
        },
      },
    },
  });
}
