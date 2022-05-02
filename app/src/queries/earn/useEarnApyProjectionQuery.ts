import { useAnchorWebapp } from '@anchor-protocol/app-provider/contexts/context';
import { HumanAddr, Rate } from '@libs/types';
import { UseQueryResult } from 'react-query';
import big, { Big } from 'big.js';
import { min, max, abs } from '@libs/big-math';
import { createQueryFn } from '@libs/react-query-utils';
import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider/env';
import { wasmFetch, QueryClient, WasmQuery } from '@libs/query-client';
import { moneyMarket } from '@anchor-protocol/types';
import { terraNativeBalancesQuery } from '@libs/app-fns';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { computeApy } from '@anchor-protocol/app-fns';

interface ProjectedEarnApyWasmQuery {
  overseerDynRateState: WasmQuery<
    moneyMarket.overseer.DynRateState,
    moneyMarket.overseer.DynRateStateResponse
  >;
  overseerConfig: WasmQuery<
    moneyMarket.overseer.Config,
    moneyMarket.overseer.ConfigResponse
  >;
}

// the logic is adapted from https://github.com/Anchor-Protocol/money-market-contracts/blob/5d902c3f029eeda6597e54763e4b608a716603a1/contracts/overseer/src/contract.rs#L389
const computeYieldReserveChange = (
  state: moneyMarket.overseer.DynRateStateResponse,
  config: moneyMarket.overseer.ConfigResponse,
  currentBalance: Big,
) => {
  const { dyn_rate_yr_increase_expectation, dyn_rate_maxchange } = config;

  const { prev_yield_reserve: previousBalance } = state;

  let isCurrentYieldReserveHigher = currentBalance.gt(previousBalance);

  const yieldReserveDelta = abs(currentBalance.minus(previousBalance));

  let yieldReserveChange = Big(previousBalance).eq(0)
    ? big(1)
    : yieldReserveDelta.div(previousBalance);

  if (!isCurrentYieldReserveHigher) {
    yieldReserveChange = yieldReserveChange.add(
      dyn_rate_yr_increase_expectation,
    );
  } else if (yieldReserveChange.gt(dyn_rate_yr_increase_expectation)) {
    yieldReserveChange = yieldReserveChange.minus(
      dyn_rate_yr_increase_expectation,
    );
  } else {
    isCurrentYieldReserveHigher = !isCurrentYieldReserveHigher;
  }

  return {
    isHigher: isCurrentYieldReserveHigher,
    change: min(yieldReserveChange, dyn_rate_maxchange),
  };
};

const computeNewRate = (
  config: moneyMarket.overseer.ConfigResponse,
  yr: ReturnType<typeof computeYieldReserveChange>,
  blocksPerYear: number,
) => {
  const { threshold_deposit_rate, dyn_rate_min, dyn_rate_max } = config;

  const bound = (rate: Big) => {
    return max(
      min(rate, computeApy(dyn_rate_max, blocksPerYear, config.epoch_period)),
      computeApy(dyn_rate_min, blocksPerYear, config.epoch_period),
    );
  };

  const currentRate = computeApy(
    threshold_deposit_rate,
    blocksPerYear,
    config.epoch_period,
  );

  if (yr.isHigher) {
    return bound(currentRate.plus(yr.change));
  }

  if (currentRate.gt(yr.change)) {
    return bound(currentRate.minus(yr.change));
  }

  return bound(big(0));
};

const earnApyProjectionQuery = async (
  blocksPerYear: number,
  overseerContract: HumanAddr,
  queryClient: QueryClient,
) => {
  const { uUST } = await terraNativeBalancesQuery(
    overseerContract,
    queryClient,
  );

  const { overseerDynRateState, overseerConfig } =
    await wasmFetch<ProjectedEarnApyWasmQuery>({
      ...queryClient,
      id: 'projected-earn-apy',
      wasmQuery: {
        overseerDynRateState: {
          contractAddress: overseerContract,
          query: { dynrate_state: {} },
        },
        overseerConfig: {
          contractAddress: overseerContract,
          query: { config: {} },
        },
      },
    });

  const change = computeYieldReserveChange(
    overseerDynRateState,
    overseerConfig,
    big(uUST),
  );

  const rate = computeNewRate(overseerConfig, change, blocksPerYear);

  return {
    rate,
    height:
      overseerDynRateState.last_executed_height + overseerConfig.dyn_rate_epoch,
  };
};

const earnApyProjectionQueryFn = createQueryFn(earnApyProjectionQuery);

interface EarnApyProjection {
  height: number;
  rate: Rate<big>;
}

export const useEarnApyProjectionQuery =
  (): UseQueryResult<EarnApyProjection> => {
    const {
      contractAddress,
      queryClient,
      constants: { blocksPerYear },
    } = useAnchorWebapp();

    return useAnchorQuery(
      [
        ANCHOR_QUERY_KEY.PROJECTED_EARN_APY,
        blocksPerYear,
        contractAddress.moneyMarket.overseer,
        queryClient,
      ],
      earnApyProjectionQueryFn,
      {
        refetchOnMount: false,
        refetchInterval: 1000 * 60 * 5,
        keepPreviousData: true,
      },
    );
  };
