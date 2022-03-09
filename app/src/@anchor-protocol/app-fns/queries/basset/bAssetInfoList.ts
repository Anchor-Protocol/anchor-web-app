import { moneyMarket } from '@anchor-protocol/types';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';
import { HumanAddr } from '@libs/types';
import { BAssetInfo, bAssetInfoQuery } from './bAssetInfo';
import { isBAsset } from './isBAsset';

interface WhitelistWasmQuery {
  whitelist: WasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >;
}

export async function bAssetInfoListQuery(
  overseerContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BAssetInfo[]> {
  const { whitelist } = await wasmFetch<WhitelistWasmQuery>({
    ...queryClient,
    id: 'basset--list',
    wasmQuery: {
      whitelist: {
        contractAddress: overseerContract,
        query: {
          whitelist: {},
        },
      },
    },
  });

  const bAssetInfos = await Promise.all(
    whitelist.elems
      .filter(({ symbol }) => isBAsset(symbol))
      .map((el) => bAssetInfoQuery(el, queryClient)),
  ).then((list) => {
    return list.filter(
      (item: BAssetInfo | undefined): item is BAssetInfo => !!item,
    );
  });

  return bAssetInfos;
}
