import { CW20Addr, HumanAddr, StableDenom } from '@anchor-protocol/types';
import {
  BorrowLiquidationPriceData,
  borrowLiquidationPriceQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    connectedWallet,
    lastSyncedHeight,
    marketContract,
    overseerContract,
    oracleContract,
    bLunaContract,
  ],
}: QueryFunctionContext<
  [
    string,
    string,
    MantleFetch,
    ConnectedWallet | undefined,
    () => Promise<number>,
    HumanAddr,
    HumanAddr,
    HumanAddr,
    CW20Addr,
  ]
>) => {
  return !!connectedWallet
    ? borrowLiquidationPriceQuery({
        mantleEndpoint,
        mantleFetch,
        lastSyncedHeight,
        variables: {
          marketContract,
          marketBorrowerInfoQuery: {
            borrower_info: {
              borrower: connectedWallet.walletAddress,
              block_height: -1,
            },
          },
          overseerContract,
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
              collateral_token: bLunaContract,
            },
          },
          oracleContract,
          oraclePriceQuery: {
            price: {
              base: bLunaContract,
              quote: 'uusd' as StableDenom,
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useBorrowLiquidationPriceQuery(): UseQueryResult<
  BorrowLiquidationPriceData | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_LIQUIDATION_PRICE,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      lastSyncedHeight,
      moneyMarket.market,
      moneyMarket.overseer,
      moneyMarket.oracle,
      cw20.bLuna,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
    },
  );
}
