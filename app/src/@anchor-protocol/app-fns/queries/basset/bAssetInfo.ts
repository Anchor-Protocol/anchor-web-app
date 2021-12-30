import {
  basset,
  cw20,
  HumanAddr,
  moneyMarket,
  Token,
} from '@anchor-protocol/types';
import { cw20TokenInfoQuery } from '@libs/app-fns';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface InfoWasmQuery {
  custodyConfig: WasmQuery<
    moneyMarket.custody.Config,
    moneyMarket.custody.ConfigResponse
  >;
  minter: WasmQuery<cw20.Minter, cw20.MinterResponse>;
}

interface WormholeTokenWasmQuery {
  converterConfig: WasmQuery<
    basset.converter.Config,
    basset.converter.ConfigResponse
  >;
}

export type BAssetInfo = WasmQueryData<
  InfoWasmQuery & WormholeTokenWasmQuery
> & {
  bAsset: moneyMarket.overseer.WhitelistResponse['elems'][number];
  wormholeTokenInfo: cw20.TokenInfoResponse<Token>;
};

export async function bAssetInfoQuery(
  bAsset: moneyMarket.overseer.WhitelistResponse['elems'][number] | undefined,
  queryClient: QueryClient,
): Promise<BAssetInfo | undefined> {
  if (!bAsset) {
    return undefined;
  }

  const { minter, custodyConfig } = await wasmFetch<InfoWasmQuery>({
    ...queryClient,
    id: `basset--info=${bAsset.collateral_token}`,
    wasmQuery: {
      minter: {
        contractAddress: bAsset.collateral_token,
        query: {
          minter: {},
        },
      },
      custodyConfig: {
        contractAddress: bAsset.custody_contract,
        query: {
          config: {},
        },
      },
    },
  });

  // TODO change to
  //const converterContract = minter.minter
  const converterContract =
    'terra1g68g7l3xkpm4hvadrqrfc53vtnfhl4dlnjm45u' as HumanAddr;

  const { converterConfig } = await wasmFetch<WormholeTokenWasmQuery>({
    ...queryClient,
    id: `basset--wormhole=${converterContract}`,
    wasmQuery: {
      converterConfig: {
        contractAddress: converterContract,
        query: {
          config: {},
        },
      },
    },
  });

  const { tokenInfo: wormholeTokenInfo } = await cw20TokenInfoQuery(
    converterConfig.wormhole_token_address!,
    queryClient,
  );

  return {
    bAsset,
    minter,
    custodyConfig,
    converterConfig,
    wormholeTokenInfo,
  };
}
