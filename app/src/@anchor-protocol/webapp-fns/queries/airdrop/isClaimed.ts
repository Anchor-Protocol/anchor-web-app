import { bluna, HumanAddr } from '@anchor-protocol/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<AirdropIsClaimed> {
  return mantle<AirdropIsClaimedWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?airdrop--is-claimed&address=${walletAddr}&stage=${airdropStage}`,
    mantleFetch,
    requestInit,
    variables: {},
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
