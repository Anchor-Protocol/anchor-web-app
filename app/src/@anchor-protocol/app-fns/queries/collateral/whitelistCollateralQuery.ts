import { HumanAddr } from '@anchor-protocol/types';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { QueryClient, wasmFetch } from '@libs/query-client';
import { WhitelistWasmQuery, WhitelistCollateral } from './types';

export async function whitelistCollateralQuery(
  overseerContract: HumanAddr,
  tokenInformation: Record<string, CW20TokenDisplayInfo> | undefined,
  queryClient: QueryClient,
): Promise<WhitelistCollateral[]> {
  const { whitelist } = await wasmFetch<WhitelistWasmQuery>({
    ...queryClient,
    id: `whitelist--collateral`,
    wasmQuery: {
      whitelist: {
        contractAddress: overseerContract,
        query: {
          whitelist: {},
        },
      },
    },
  });

  return whitelist.elems.map((collateral) => {
    if (
      collateral &&
      tokenInformation &&
      tokenInformation[collateral.collateral_token]
    ) {
      const token = tokenInformation[collateral.collateral_token];
      return {
        ...token,
        ...collateral,
        name: token.name ?? collateral.name,
        symbol: token.symbol ?? collateral.symbol,
      };
    }
    return collateral;
  });
}
