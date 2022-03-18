import { EVMAddr, HumanAddr, crossAnchor } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface TerraAddressWasmQuery {
  terraAddress: WasmQuery<
    crossAnchor.core.TerraAddress,
    crossAnchor.core.TerraAddressResponse
  >;
}

export type TerraAddress = WasmQueryData<TerraAddressWasmQuery>;

export async function terraAddressQuery(
  nativeAddress: EVMAddr,
  nativeChain: number,
  crossAnchorContractAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<TerraAddress | undefined> {
  if (!nativeAddress) {
    return undefined;
  }
  return wasmFetch<TerraAddressWasmQuery>({
    ...queryClient,
    id: `crossanchor--terra-address`,
    wasmQuery: {
      terraAddress: {
        contractAddress: crossAnchorContractAddr,
        query: {
          terra_address: {
            sender_address: nativeAddress,
            sender_chain: nativeChain,
          },
        },
      },
    },
  });
}
