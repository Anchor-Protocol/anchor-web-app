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

type WhitelistElement = moneyMarket.overseer.WhitelistResponse['elems'][0];

async function bAssetInfoByTokenQuery(
  overseerContract: HumanAddr,
  queryClient: QueryClient,
  predicate: (elem: WhitelistElement) => boolean,
): Promise<WhitelistElement | undefined> {
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
  return whitelist.elems.find(predicate);
}

export async function bAssetInfoByTokenAddrQuery(
  overseerContract: HumanAddr,
  tokenAddr: CW20Addr | undefined,
  queryClient: QueryClient,
): Promise<BAssetInfo | undefined> {
  const bAsset = await bAssetInfoByTokenQuery(
    overseerContract,
    queryClient,
    ({ collateral_token }) => tokenAddr === collateral_token,
  );

  if (!bAsset) {
    throw new Error(`Can't find bAssetInfo of "${tokenAddr}"`);
  }

  return bAssetInfoQuery(bAsset, queryClient);
}

export async function bAssetInfoByTokenSymbolQuery(
  overseerContract: HumanAddr,
  tokenSymbol: string | undefined,
  queryClient: QueryClient,
): Promise<BAssetInfo | undefined> {
  if (tokenSymbol === undefined) {
    return undefined;
  }

  const bAsset = await bAssetInfoByTokenQuery(
    overseerContract,
    queryClient,
    ({ symbol }) => symbol?.toLowerCase() === tokenSymbol?.toLowerCase(),
  );

  if (!bAsset) {
    throw new Error(`Can't find bAssetInfo of "${tokenSymbol}"`);
  }

  return bAssetInfoQuery(bAsset, queryClient);
}
