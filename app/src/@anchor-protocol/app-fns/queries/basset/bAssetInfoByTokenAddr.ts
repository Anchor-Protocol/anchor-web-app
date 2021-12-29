import { CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';
import { HumanAddr } from '@libs/types';
import { BAssetInfo, bAssetInfoQuery } from './bAssetInfo';

interface WhitelistWasmQuery {
  whitelist: WasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >;
}

export async function bAssetInfoByTokenAddrQuery(
  overseerContract: HumanAddr,
  tokenAddr: CW20Addr | undefined,
  queryClient: QueryClient,
): Promise<BAssetInfo | undefined> {
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

  const bAsset = whitelist.elems.find(
    ({ collateral_token }) => tokenAddr === collateral_token,
  );

  if (!bAsset) {
    throw new Error(`Can't find bAssetInfo of "${tokenAddr}"`);
  }

  return bAssetInfoQuery(bAsset, queryClient);
}
