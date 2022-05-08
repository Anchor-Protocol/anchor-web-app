import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { CW20Addr, u } from '@libs/types';
import { BigSource } from 'big.js';
import { useQuery } from 'react-query';
import { createQueryFn } from '@libs/react-query-utils';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { veANC, anchorToken } from '@anchor-protocol/types';

export interface GaugeCollateral {
  tokenAddress: CW20Addr;
  symbol: string;
  name: string;
  icon: string;
  votes: u<veANC<BigSource>>;
  share: number;
}

interface AllGaugeAddrWasmQuery {
  allGaugeAddr: WasmQuery<
    anchorToken.gaugeController.AllGaugeAddr,
    anchorToken.gaugeController.AllGaugeAddrResponse
  >;
}

const collateralGaugeAddrQuery = async (
  gaugeControllerContract: string,
  queryClient: QueryClient,
) => {
  const {
    allGaugeAddr: { all_gauge_addr },
  } = await wasmFetch<AllGaugeAddrWasmQuery>({
    ...queryClient,
    id: 'all-gauge-addr',
    wasmQuery: {
      allGaugeAddr: {
        contractAddress: gaugeControllerContract,
        query: {
          all_gauge_addr: {},
        },
      },
    },
  });

  return all_gauge_addr;
};

const collateralGaugeAddrQueryFn = createQueryFn(collateralGaugeAddrQuery);

export const useCollateralGaugeAddrQuery = () => {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const gaugeControllerContract = contractAddress.anchorToken.gaugeController;

  return useQuery(
    [ANCHOR_QUERY_KEY.GAUGES, gaugeControllerContract, queryClient],
    collateralGaugeAddrQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: !!gaugeControllerContract,
      onError: queryErrorReporter,
    },
  );
};
