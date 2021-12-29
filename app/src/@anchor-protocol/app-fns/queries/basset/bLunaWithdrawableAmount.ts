import { bluna, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface WithdrawableAmountWasmQuery {
  withdrawableUnbonded: WasmQuery<
    bluna.hub.WithdrawableUnbonded,
    bluna.hub.WithdrawableUnbondedResponse
  >;
  unbondedRequests: WasmQuery<
    bluna.hub.UnbondRequests,
    bluna.hub.UnbondRequestsResponse
  >;
}

interface WithdrawableHistoryWasmQuery {
  allHistory: WasmQuery<bluna.hub.AllHistory, bluna.hub.AllHistoryResponse>;
  parameters: WasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>;
}

type BLunaWithdrawableAmountWasmQuery = WithdrawableAmountWasmQuery &
  WithdrawableHistoryWasmQuery;

export type BLunaWithdrawableAmount = Omit<
  WasmQueryData<BLunaWithdrawableAmountWasmQuery>,
  'parameters'
> & {
  unbondedRequestsStartFrom: number;
  parameters?: bluna.hub.ParametersResponse;
};

export async function bLunaWithdrawableAmountQuery(
  walletAddr: HumanAddr | undefined,
  bLunaHubContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BLunaWithdrawableAmount | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  const { withdrawableUnbonded, unbondedRequests } =
    await wasmFetch<WithdrawableAmountWasmQuery>({
      ...queryClient,
      id: `bond--withdrawable-requests`,
      wasmQuery: {
        withdrawableUnbonded: {
          contractAddress: bLunaHubContract,
          query: {
            withdrawable_unbonded: {
              block_time: Math.floor(Date.now() / 1000),
              address: walletAddr,
            },
          },
        },
        unbondedRequests: {
          contractAddress: bLunaHubContract,
          query: {
            unbond_requests: {
              address: walletAddr,
            },
          },
        },
      },
    });

  const unbondedRequestsStartFrom: number =
    unbondedRequests.requests.length > 0
      ? Math.max(
          0,
          Math.min(...unbondedRequests.requests.map(([index]) => index)) - 1,
        )
      : 0;

  if (unbondedRequestsStartFrom > 0) {
    const { allHistory, parameters } =
      await wasmFetch<WithdrawableHistoryWasmQuery>({
        ...queryClient,
        id: `bond--withdraw-history`,
        wasmQuery: {
          allHistory: {
            contractAddress: bLunaHubContract,
            query: {
              all_history: {
                start_from: unbondedRequestsStartFrom,
                limit: 100,
              },
            },
          },
          parameters: {
            contractAddress: bLunaHubContract,
            query: {
              parameters: {},
            },
          },
        },
      });

    return {
      withdrawableUnbonded,
      unbondedRequests,
      unbondedRequestsStartFrom,
      allHistory,
      parameters,
    };
  } else {
    return {
      withdrawableUnbonded,
      unbondedRequests,
      unbondedRequestsStartFrom,
      allHistory: {
        history: [],
      },
    };
  }
}
