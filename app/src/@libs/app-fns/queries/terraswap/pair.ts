import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { HumanAddr, terraswap } from '@libs/types';

export interface TerraswapPairWasmQuery {
  terraswapPair: WasmQuery<
    terraswap.factory.Pair,
    terraswap.factory.PairResponse
  >;
}

export type TerraswapPair = WasmQueryData<TerraswapPairWasmQuery>;

export async function terraswapPairQuery(
  terraswapFactoryAddr: HumanAddr,
  assetInfos: [terraswap.AssetInfo, terraswap.AssetInfo],
  queryClient: QueryClient,
): Promise<TerraswapPair> {
  const urlQuery = assetInfos
    .reduce((urlQueries, asset, i) => {
      if ('token' in asset) {
        urlQueries.push(`token_${i + 1}=${asset.token.contract_addr}`);
      } else if ('native_token' in asset) {
        urlQueries.push(`native_token_${i + 1}=${asset.native_token.denom}`);
      }
      return urlQueries;
    }, [] as string[])
    .join('&');

  return wasmFetch<TerraswapPairWasmQuery>({
    ...queryClient,
    id: `terraswap--pair&${urlQuery}`,
    wasmQuery: {
      terraswapPair: {
        contractAddress: terraswapFactoryAddr,
        query: {
          pair: {
            asset_infos: assetInfos,
          },
        },
      },
    },
  });
}
