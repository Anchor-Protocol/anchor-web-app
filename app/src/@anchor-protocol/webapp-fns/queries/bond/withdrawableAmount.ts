import { bluna } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface BondWithdrawableAmountWasmQuery {
  withdrawableUnbonded: WasmQuery<
    bluna.hub.WithdrawableUnbonded,
    bluna.hub.WithdrawableUnbondedResponse
  >;
  unbondedRequests: WasmQuery<
    bluna.hub.UnbondRequests,
    bluna.hub.UnbondRequestsResponse
  >;
  allHistory: WasmQuery<bluna.hub.AllHistory, bluna.hub.AllHistoryResponse>;
  parameters: WasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>;
}

export type BondWithdrawableAmount = Omit<
  WasmQueryData<BondWithdrawableAmountWasmQuery>,
  'parameters'
> & {
  unbondedRequestsStartFrom: number;
  parameters?: bluna.hub.ParametersResponse;
};

export type BondWithdrawableAmountQueryParams = Omit<
  MantleParams<BondWithdrawableAmountWasmQuery>,
  'query' | 'variables'
>;

export async function bondWithdrawableAmountQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: BondWithdrawableAmountQueryParams): Promise<BondWithdrawableAmount> {
  type WithdrawableAmountWasmQuery = Pick<
    BondWithdrawableAmountWasmQuery,
    'withdrawableUnbonded' | 'unbondedRequests'
  >;
  type WithdrawableHistoryWasmQuery = Pick<
    BondWithdrawableAmountWasmQuery,
    'allHistory' | 'parameters'
  >;

  const { withdrawableUnbonded, unbondedRequests } =
    await mantle<WithdrawableAmountWasmQuery>({
      mantleEndpoint: `${mantleEndpoint}?bond--withdrawable-requests`,
      variables: {},
      wasmQuery: {
        withdrawableUnbonded: wasmQuery.withdrawableUnbonded,
        unbondedRequests: wasmQuery.unbondedRequests,
      },
      ...params,
    });

  const unbondedRequestsStartFrom: number =
    unbondedRequests.requests.length > 0
      ? Math.max(
          0,
          Math.min(...unbondedRequests.requests.map(([index]) => index)) - 1,
        )
      : 0;

  if (unbondedRequestsStartFrom > 0) {
    wasmQuery.allHistory.query.all_history.start_from =
      unbondedRequestsStartFrom;

    const { allHistory, parameters } =
      await mantle<WithdrawableHistoryWasmQuery>({
        mantleEndpoint: `${mantleEndpoint}?bond--withdraw-history`,
        variables: {},
        wasmQuery: {
          allHistory: wasmQuery.allHistory,
          parameters: wasmQuery.parameters,
        },
        ...params,
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
