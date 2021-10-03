import {
  ANC,
  AncUstLP,
  HumanAddr,
  terraswap,
  Token,
  u,
  UST,
} from '@anchor-protocol/types';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';
import big from 'big.js';

interface AncPriceWasmQuery {
  ancPrice: WasmQuery<
    terraswap.pair.Pool,
    terraswap.pair.PoolResponse<Token, Token>
  >;
}

export interface AncPrice {
  ANCPoolSize: u<ANC>;
  USTPoolSize: u<UST>;
  LPShare: u<AncUstLP>;
  ANCPrice: UST;
}

export interface AncPriceData {
  ancPrice: AncPrice;
}

/** @deprecated use @libs/app-fns */
export async function ancPriceQuery(
  ancUstPairAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<AncPriceData> {
  const {
    ancPrice: { assets, total_share },
  } = await wasmFetch<AncPriceWasmQuery>({
    ...queryClient,
    id: `anc--price`,
    wasmQuery: {
      ancPrice: {
        contractAddress: ancUstPairAddr,
        query: {
          pool: {},
        },
      },
    },
  });

  const ANCPoolSize = assets[0].amount as unknown as u<ANC>;
  const USTPoolSize = assets[1].amount as unknown as u<UST>;
  const LPShare = total_share as unknown as u<AncUstLP>;
  const ANCPrice = big(USTPoolSize)
    .div(+ANCPoolSize === 0 ? '1' : ANCPoolSize)
    .toString() as UST;

  return {
    ancPrice: {
      ANCPoolSize,
      USTPoolSize,
      LPShare,
      ANCPrice: ANCPrice.toLowerCase() === 'nan' ? ('0' as UST) : ANCPrice,
    },
  };
}
