import {
  terraswap,
  uANC,
  uAncUstLP,
  UST,
  uToken,
  uUST,
} from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery } from '@terra-money/webapp-fns';
import big from 'big.js';

export interface AncPriceWasmQuery {
  ancPrice: WasmQuery<terraswap.Pool, terraswap.PoolResponse<uToken>>;
}

export interface AncPrice {
  ANCPoolSize: uANC;
  USTPoolSize: uUST;
  LPShare: uAncUstLP;
  ANCPrice: UST;
}

export interface AncPriceData {
  ancPrice: AncPrice;
}

export type AncPriceQueryParams = Omit<
  MantleParams<AncPriceWasmQuery>,
  'query' | 'variables'
>;

export async function ancPriceQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: AncPriceQueryParams): Promise<AncPriceData> {
  const {
    ancPrice: { assets, total_share },
  } = await mantle<AncPriceWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?anc--price`,
    variables: {},
    wasmQuery,
    ...params,
  });

  const ANCPoolSize = assets[0].amount as unknown as uANC;
  const USTPoolSize = assets[1].amount as unknown as uUST;
  const LPShare = total_share as unknown as uAncUstLP;
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
