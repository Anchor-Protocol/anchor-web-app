import { HumanAddr, CW20Addr, moneyMarket } from '@anchor-protocol/types';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';

interface WhitelistWasmQuery {
  whitelist: WasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >;
}

export type Collateral = moneyMarket.overseer.WhitelistResponse['elems'][0];

export async function collateralByTokenAddrQuery(
  overseerContract: HumanAddr,
  collateralToken: CW20Addr | undefined,
  tokenInformation: Record<string, CW20TokenDisplayInfo> | undefined,
  queryClient: QueryClient,
): Promise<Collateral | undefined> {
  if (collateralToken === undefined) {
    return undefined;
  }

  const { whitelist } = await wasmFetch<WhitelistWasmQuery>({
    ...queryClient,
    id: `collateral--token=${collateralToken}`,
    wasmQuery: {
      whitelist: {
        contractAddress: overseerContract,
        query: {
          whitelist: {
            collateral_token: collateralToken,
          },
        },
      },
    },
  });

  const collateral =
    whitelist.elems.length > 0 ? whitelist.elems[0] : undefined;

  if (
    collateral &&
    tokenInformation &&
    tokenInformation[collateral.collateral_token]
  ) {
    return {
      ...collateral,
      symbol: tokenInformation[collateral.collateral_token].symbol,
    };
  }

  return collateral;
}
