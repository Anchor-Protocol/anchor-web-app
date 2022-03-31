import { useAnchorWebapp } from '@anchor-protocol/app-provider/contexts/context';
import { HumanAddr, Rate } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import big from 'big.js';
import { createQueryFn } from '@libs/react-query-utils';
import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider/env';
import { wasmFetch, QueryClient, WasmQuery } from '@libs/query-client';
import { moneyMarket } from '@anchor-protocol/types';
import { terraNativeBalancesQuery } from '@libs/app-fns';

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

// the logic is copied from https://github.com/Anchor-Protocol/money-market-contracts/blob/5d902c3f029eeda6597e54763e4b608a716603a1/contracts/overseer/src/contract.rs#L389
const projectedEarnApyQuery = async (
  blocksPerYear: number,
  overseerContract: HumanAddr,
  queryClient: QueryClient,
) => {
  const { uUST } = await terraNativeBalancesQuery(
    overseerContract,
    queryClient,
  );
  const currentYieldReserve = big(uUST);

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
  const prevYieldReserve = big(overseerDynRateState.prev_yield_reserve);
  const dynRateMaxChange = big(overseerConfig.dyn_rate_maxchange);
  const thresholdDepositRate = big(overseerConfig.threshold_deposit_rate);
  const dynRateYearIncreaseExpectation = big(
    overseerConfig.dyn_rate_yr_increase_expectation,
  );
  const dynApyMin = big(overseerConfig.dyn_rate_min).mul(blocksPerYear);
  const dynApyMax = big(overseerConfig.dyn_rate_max).mul(blocksPerYear);

  const currentRate = thresholdDepositRate.mul(blocksPerYear);

  let isCurrentYieldReserveHigher = currentYieldReserve > prevYieldReserve;

  const yieldReserveDelta = isCurrentYieldReserveHigher
    ? currentYieldReserve.minus(prevYieldReserve)
    : prevYieldReserve.minus(currentYieldReserve);

  let yieldReserveChange = prevYieldReserve.eq(0)
    ? big(1)
    : yieldReserveDelta.div(prevYieldReserve);

  let increaseExpectation = dynRateYearIncreaseExpectation;
  if (!isCurrentYieldReserveHigher) {
    yieldReserveChange = yieldReserveChange.add(increaseExpectation);
  } else if (currentRate.lt(yieldReserveChange)) {
    yieldReserveChange = yieldReserveChange.minus(increaseExpectation);
  } else {
    isCurrentYieldReserveHigher = !isCurrentYieldReserveHigher;
    increaseExpectation = increaseExpectation.minus(yieldReserveChange);
  }

  if (yieldReserveChange.lt(dynRateMaxChange)) {
    yieldReserveChange = dynRateMaxChange;
  }

  let projectedEarnApy = big(0);
  if (isCurrentYieldReserveHigher) {
    projectedEarnApy = currentRate.plus(yieldReserveChange);
  } else if (currentRate.lt(yieldReserveChange)) {
    projectedEarnApy = currentRate.minus(yieldReserveChange);
  }

  if (projectedEarnApy < dynApyMin) {
    projectedEarnApy = dynApyMin;
  } else if (projectedEarnApy > dynApyMax) {
    projectedEarnApy = dynApyMax;
  }

  return projectedEarnApy;
};

const projectedEarnApyQueryFn = createQueryFn(projectedEarnApyQuery);

export const useProjectedEarnApy = (): UseQueryResult<Rate<big>> => {
  const {
    queryErrorReporter,
    contractAddress,
    queryClient,
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.PROJECTED_EARN_APY,
      blocksPerYear,
      contractAddress.moneyMarket.overseer,
      queryClient,
    ],
    projectedEarnApyQueryFn,
    {
      refetchInterval: 1000 * 60,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
};
