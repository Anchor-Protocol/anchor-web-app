import { StableDenom } from '@anchor-protocol/types';
import {
  ANCHOR_QUERY_KEY,
  BorrowLiquidationPriceData,
  borrowLiquidationPriceQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider/contexts/context';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export function useBorrowLiquidationPriceQuery(): UseQueryResult<
  BorrowLiquidationPriceData | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const queryFn = useCallback(() => {
    return !!connectedWallet
      ? borrowLiquidationPriceQuery({
          mantleEndpoint,
          mantleFetch,
          lastSyncedHeight,
          variables: {
            marketContract: moneyMarket.market,
            marketBorrowerInfoQuery: {
              borrower_info: {
                borrower: connectedWallet.walletAddress,
                block_height: -1,
              },
            },
            overseerContract: moneyMarket.overseer,
            overseerBorrowlimitQuery: {
              borrow_limit: {
                borrower: connectedWallet.walletAddress,
                block_time: -1,
              },
            },
            overseerCollateralsQuery: {
              collaterals: {
                borrower: connectedWallet.walletAddress,
              },
            },
            overseerWhitelistQuery: {
              whitelist: {
                collateral_token: cw20.bLuna,
              },
            },
            oracleContract: moneyMarket.oracle,
            oraclePriceQuery: {
              price: {
                base: cw20.bLuna,
                quote: 'uusd' as StableDenom,
              },
            },
          },
        })
      : Promise.resolve(undefined);
  }, [
    connectedWallet,
    cw20.bLuna,
    lastSyncedHeight,
    mantleEndpoint,
    mantleFetch,
    moneyMarket.market,
    moneyMarket.oracle,
    moneyMarket.overseer,
  ]);

  return useQuery(ANCHOR_QUERY_KEY.BORROW_LIQUIDATION_PRICE, queryFn, {
    refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
    enabled: !browserInactive && !!connectedWallet,
    keepPreviousData: true,
  });
}
