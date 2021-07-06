import { CW20Addr, HumanAddr, StableDenom } from '@anchor-protocol/types';
import {
  BorrowLiquidationPrice,
  borrowLiquidationPriceQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    lastSyncedHeight: () => Promise<number>,
    marketContract: HumanAddr,
    overseerContract: HumanAddr,
    oracleContract: HumanAddr,
    bAssetContract: CW20Addr,
  ) => {
    return !!connectedWallet
      ? borrowLiquidationPriceQuery({
          mantleEndpoint,
          mantleFetch,
          lastSyncedHeight,
          wasmQuery: {
            marketBorrowerInfo: {
              contractAddress: marketContract,
              query: {
                borrower_info: {
                  borrower: connectedWallet.walletAddress,
                  block_height: -1,
                },
              },
            },
            overseerBorrowLimit: {
              contractAddress: overseerContract,
              query: {
                borrow_limit: {
                  borrower: connectedWallet.walletAddress,
                  block_time: -1,
                },
              },
            },
            overseerCollaterals: {
              contractAddress: overseerContract,
              query: {
                collaterals: {
                  borrower: connectedWallet.walletAddress,
                },
              },
            },
            overseerWhitelist: {
              contractAddress: overseerContract,
              query: {
                whitelist: {
                  collateral_token: bAssetContract,
                },
              },
            },
            oraclePriceInfo: {
              contractAddress: oracleContract,
              query: {
                price: {
                  base: bAssetContract,
                  quote: 'uusd' as StableDenom,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useBorrowLiquidationPriceQuery(
  bAssetContract: CW20Addr,
): UseQueryResult<BorrowLiquidationPrice | undefined> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight, queryErrorReporter } =
    useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_LIQUIDATION_PRICE,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      lastSyncedHeight,
      moneyMarket.market,
      moneyMarket.overseer,
      moneyMarket.oracle,
      bAssetContract,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
