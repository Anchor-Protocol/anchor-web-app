import { CW20Addr, HumanAddr, StableDenom } from '@anchor-protocol/types';
import {
  BorrowLiquidationPrice,
  borrowLiquidationPriceQuery,
} from '@anchor-protocol/webapp-fns';
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
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    {
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      lastSyncedHeight,
      marketContract,
      overseerContract,
      oracleContract,
      bLunaContract,
    },
  ],
}: QueryFunctionContext<
  [
    string,
    {
      mantleEndpoint: string;
      mantleFetch: MantleFetch;
      connectedWallet: ConnectedWallet | undefined;
      lastSyncedHeight: () => Promise<number>;
      marketContract: HumanAddr;
      overseerContract: HumanAddr;
      oracleContract: HumanAddr;
      bLunaContract: CW20Addr;
    },
  ]
>) => {
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
                collateral_token: bLunaContract,
              },
            },
          },
          oraclePriceInfo: {
            contractAddress: oracleContract,
            query: {
              price: {
                base: bLunaContract,
                quote: 'uusd' as StableDenom,
              },
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useBorrowLiquidationPriceQuery(): UseQueryResult<
  BorrowLiquidationPrice | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight, queryErrorReporter } =
    useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_LIQUIDATION_PRICE,
      {
        mantleEndpoint,
        mantleFetch,
        connectedWallet,
        lastSyncedHeight,
        marketContract: moneyMarket.market,
        overseerContract: moneyMarket.overseer,
        oracleContract: moneyMarket.oracle,
        bLunaContract: cw20.bLuna,
      },
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
