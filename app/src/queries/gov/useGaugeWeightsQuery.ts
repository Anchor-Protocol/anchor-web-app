import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { anchorToken, veANC } from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, u } from '@anchor-protocol/types';
import { BigSource } from 'big.js';

type GaugeWeightsWasmQuery = Record<
  CW20Addr,
  WasmQuery<
    anchorToken.gaugeController.GaugeWeight,
    anchorToken.gaugeController.GaugeWeightResponse
  >
>;

type GaugeWeightsRecord = Record<CW20Addr, u<veANC<BigSource>>>;

const gaugeWeightsQuery = async (
  gaugeControllerContract: string,
  addresses: CW20Addr[],
  queryClient: QueryClient,
) => {
  const gaugeWeights = await wasmFetch<GaugeWeightsWasmQuery>({
    ...queryClient,
    id: 'gauge-weights',
    wasmQuery: addresses.reduce(
      (acc, gauge_addr) => ({
        ...acc,
        [gauge_addr]: {
          contractAddress: gaugeControllerContract,
          query: { gauge_weight: { gauge_addr } },
        },
      }),
      {},
    ),
  });

  const gaugeWeightsRecord: GaugeWeightsRecord = Object.entries(
    gaugeWeights,
  ).reduce((acc, [key, value]) => {
    if (addresses.includes(key as CW20Addr)) {
      const { gauge_weight } =
        value as anchorToken.gaugeController.GaugeWeightResponse;
      acc[key as CW20Addr] = gauge_weight;
    }

    return acc;
  }, {} as GaugeWeightsRecord);

  return gaugeWeightsRecord;
};

const gaugeWeightsQueryFn = createQueryFn(gaugeWeightsQuery);

interface GaugeWeightsQueryParams {
  addresses: CW20Addr[];
  enabled?: boolean;
}

export const useGaugeWeightsQuery = ({
  addresses,
  enabled = true,
}: GaugeWeightsQueryParams) => {
  const { queryClient, contractAddress } = useAnchorWebapp();

  const gaugeControllerContract = contractAddress.anchorToken.gaugeController;

  return useAnchorQuery(
    [
      ANCHOR_QUERY_KEY.GOV_CONFIG,
      gaugeControllerContract,
      addresses,
      queryClient,
    ],
    gaugeWeightsQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: enabled && !!gaugeControllerContract,
    },
  );
};
