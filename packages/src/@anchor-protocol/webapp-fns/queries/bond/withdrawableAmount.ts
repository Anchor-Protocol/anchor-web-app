import { bluna, HumanAddr, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BondWithdrawableAmountRawData {
  withdrawableUnbonded: WASMContractResult;
  unbondedRequests: WASMContractResult;
}

export interface BondWithdrawableAmountData {
  withdrawableUnbonded: bluna.hub.WithdrawableUnbondedResponse;
  unbondedRequests: bluna.hub.UnbondRequestsResponse;
  unbondedRequestsStartFrom: number;
}

export interface BondWithdrawableAmountRawVariables {
  bLunaHubContract: string;
  withdrawableUnbondedQuery: string;
  unbondedRequestsQuery: string;
}

export interface BondWithdrawableAmountVariables {
  bLunaHubContract: HumanAddr;
  withdrawableUnbondedQuery: bluna.hub.WithdrawableUnbonded;
  unbondedRequestsQuery: bluna.hub.UnbondRequests;
}

// language=graphql
export const BOND_WITHDRAWABLE_AMOUNT_QUERY = `
  query __withdrawable(
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
  const rawData = await mantleFetch<
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

  const unbondedRequests: bluna.hub.UnbondRequestsResponse = JSON.parse(
    rawData.unbondedRequests.Result,
  );

  return {
    withdrawableUnbonded: JSON.parse(rawData.withdrawableUnbonded.Result),
    unbondedRequests,
    unbondedRequestsStartFrom:
      unbondedRequests.requests.length > 0
        ? Math.max(
            0,
            Math.min(...unbondedRequests.requests.map(([index]) => index)) - 1,
          )
        : -1,
  };
}
