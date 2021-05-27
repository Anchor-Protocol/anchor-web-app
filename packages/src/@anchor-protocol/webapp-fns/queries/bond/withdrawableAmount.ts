import { bluna, HumanAddr, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BondWithdrawableAmountRawData {
  withdrawableUnbonded: WASMContractResult;
  unbondedRequests: WASMContractResult;
}

export interface BondWithdrawHistoryRawData {
  allHistory: WASMContractResult;
  parameters: WASMContractResult;
}

export interface BondWithdrawableAmountData {
  withdrawableUnbonded: bluna.hub.WithdrawableUnbondedResponse;
  unbondedRequests: bluna.hub.UnbondRequestsResponse;
  allHistory: bluna.hub.AllHistoryResponse;
  parameters?: bluna.hub.ParametersResponse;
}

export interface BondWithdrawableAmountRawVariables {
  bLunaHubContract: string;
  withdrawableUnbondedQuery: string;
  unbondedRequestsQuery: string;
}

export interface BondWithdrawHistoryRawVariables {
  bLunaHubContract: string;
  allHistoryQuery: string;
  parametersQuery: string;
}

export interface BondWithdrawableAmountVariables {
  bLunaHubContract: HumanAddr;
  withdrawableUnbondedQuery: bluna.hub.WithdrawableUnbonded;
  unbondedRequestsQuery: bluna.hub.UnbondRequests;
  allHistoryQuery: bluna.hub.AllHistory;
  parametersQuery: bluna.hub.Parameters;
}

// language=graphql
export const BOND_WITHDRAWABLE_AMOUNT_QUERY = `
  query (
    $bLunaHubContract: String!
    $withdrawableUnbondedQuery: String!
    $unbondedRequestsQuery: String!
  ) {
    withdrawableUnbonded: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $withdrawableUnbondedQuery
    ) {
      Result
    }

    unbondedRequests: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $unbondedRequestsQuery
    ) {
      Result
    }
  }
`;

// language=graphql
export const BOND_WITHDRAW_HISTORY_QUERY = `
  query (
    $bLunaHubContract: String!
    $allHistoryQuery: String!
    $parametersQuery: String!
  ) {
    allHistory: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $allHistoryQuery
    ) {
      Result
    }

    parameters: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $parametersQuery
    ) {
      Result
    }
  }
`;

export interface BondWithdrawableAmountQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BondWithdrawableAmountVariables;
}

export async function bondWithdrawableAmountQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BondWithdrawableAmountQueryParams): Promise<BondWithdrawableAmountData> {
  const withdrawableAmountRawData = await mantleFetch<
    BondWithdrawableAmountRawVariables,
    BondWithdrawableAmountRawData
  >(
    BOND_WITHDRAWABLE_AMOUNT_QUERY,
    {
      bLunaHubContract: variables.bLunaHubContract,
      withdrawableUnbondedQuery: JSON.stringify(
        variables.withdrawableUnbondedQuery,
      ),
      unbondedRequestsQuery: JSON.stringify(variables.unbondedRequestsQuery),
    },
    `${mantleEndpoint}?bond--withdrawable-requests`,
  );

  const withdrawableAmountData: Pick<
    BondWithdrawableAmountData,
    'unbondedRequests' | 'withdrawableUnbonded'
  > = JSON.parse(withdrawableAmountRawData.unbondedRequests.Result);

  const unbondedRequestsStartFrom: number =
    withdrawableAmountData.unbondedRequests.requests.length > 0
      ? Math.max(
          0,
          Math.min(
            ...withdrawableAmountData.unbondedRequests.requests.map(
              ([index]) => index,
            ),
          ) - 1,
        )
      : 0;

  if (unbondedRequestsStartFrom > 0) {
    variables.allHistoryQuery.all_history.start_from = unbondedRequestsStartFrom;

    const withdrawHistoryRawData = await mantleFetch<
      BondWithdrawHistoryRawVariables,
      BondWithdrawHistoryRawData
    >(
      BOND_WITHDRAW_HISTORY_QUERY,
      {
        bLunaHubContract: variables.bLunaHubContract,
        allHistoryQuery: JSON.stringify(variables.allHistoryQuery),
        parametersQuery: JSON.stringify(variables.parametersQuery),
      },
      `${mantleEndpoint}?bond--withdraw-history`,
    );

    return {
      ...withdrawableAmountData,
      allHistory: JSON.parse(withdrawHistoryRawData.allHistory.Result),
      parameters: JSON.parse(withdrawHistoryRawData.parameters.Result),
    };
  } else {
    return {
      ...withdrawableAmountData,
      allHistory: {
        history: [],
      },
    };
  }
}
