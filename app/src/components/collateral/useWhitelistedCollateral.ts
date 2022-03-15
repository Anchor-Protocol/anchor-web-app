import { useBorrowMarketQuery } from '@anchor-protocol/app-provider';
import { useBridgeAssetsQuery } from 'queries';
import { useMemo } from 'react';

export const useWhitelistedCollateral = () => {
  const { data: borrowMarket } = useBorrowMarketQuery();
  const { data: bridgeAssets } = useBridgeAssetsQuery(
    borrowMarket?.overseerWhitelist.elems,
  );

  return useMemo(() => {
    if (!borrowMarket || !bridgeAssets) {
      return [];
    }

    const whitelist = borrowMarket.overseerWhitelist.elems.filter((elem) => {
      return bridgeAssets.has(elem.collateral_token);
    });

    return whitelist;
  }, [borrowMarket, bridgeAssets]);
};
