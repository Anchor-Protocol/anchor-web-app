import { useNetwork } from '@anchor-protocol/app-provider';
import { TokenDisplayInfo } from '@libs/app-fns';
import { cw20, terraswap, Token } from '@libs/types';
import { useMemo } from 'react';
import { useTokenDisplayInfosQuery } from './tokenDisplayInfos';
import { useTerraTokenInfo } from './tokenInfo';

interface DisplayInfo {
  tokenInfo: cw20.TokenInfoResponse<Token> | undefined;
  tokenDisplayInfo: TokenDisplayInfo | undefined;
}

export function useTerraTokenDisplayInfo(
  assetInfo: terraswap.AssetInfo,
  networkName?: string,
): DisplayInfo {
  const network = useNetwork();

  const { data: tokenInfo } = useTerraTokenInfo(assetInfo);
  const { data: tokenDisplayInfos } = useTokenDisplayInfosQuery(
    networkName ?? network.name,
  );

  return useMemo(() => {
    return {
      tokenInfo,
      tokenDisplayInfo: tokenDisplayInfos?.find(({ asset }) => {
        return JSON.stringify(asset) === JSON.stringify(assetInfo);
      }),
    };
  }, [assetInfo, tokenDisplayInfos, tokenInfo]);
}
