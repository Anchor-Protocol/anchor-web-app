import { HumanAddr, CW20Addr } from '@anchor-protocol/types';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { QueryClient, wasmFetch } from '@libs/query-client';
import { WhitelistWasmQuery, WhitelistCollateral } from './types';

export async function whitelistCollateralByTokenAddrQuery(
  overseerContract: HumanAddr,
  collateralToken: CW20Addr | undefined,
  tokenInformation: Record<string, CW20TokenDisplayInfo> | undefined,
  queryClient: QueryClient,
): Promise<WhitelistCollateral | undefined> {
  if (collateralToken === undefined) {
    return undefined;
  }

  const { whitelist } = await wasmFetch<WhitelistWasmQuery>({
    ...queryClient,
    id: `whitelist--collateral--token=${collateralToken}`,
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
    const token = tokenInformation[collateral.collateral_token];
    return {
      ...token,
      ...collateral,
      name: token.name ?? collateral.name,
      symbol: token.symbol ?? collateral.symbol,
    };
  }

  return collateral;
}
