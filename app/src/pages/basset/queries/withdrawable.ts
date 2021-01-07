import { gql } from '@apollo/client';

export interface StringifiedData {
  withdrawableAmount: {
    Result: string;
  };
  withdrawRequests: {
    Result: string;
  };
}

export interface Data {
  withdrawableAmount: {
    withdrawable: string;
  };
  withdrawRequests: {
    address: string;
    requests: [number, string][];
  };
  withdrawRequestsStartFrom: number;
}

export function parseData({
  withdrawableAmount,
  withdrawRequests,
}: StringifiedData): Data {
  const parsedWithdrawRequests: Data['withdrawRequests'] = JSON.parse(withdrawRequests.Result);
  return {
    withdrawableAmount: JSON.parse(withdrawableAmount.Result),
    withdrawRequests: parsedWithdrawRequests,
    withdrawRequestsStartFrom: parsedWithdrawRequests.requests.length > 0
      ? Math.min(...parsedWithdrawRequests.requests.map(([index]) => index))
      : -1,
  };
}

export interface StringifiedVariables {
  bLunaHubContract: string;
  withdrawableAmountQuery: string;
  withdrawRequestsQuery: string;
  exchangeRateQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  withdrawableAmountQuery: {
    withdrawable_unbonded: {
      address: string;
      block_time: number;
    };
  };
  withdrawRequestsQuery: {
    unbond_requests: {
      address: string;
    };
  };
  exchangeRateQuery: {
    state: {};
  };
}

export function stringifyVariables({
  bLunaHubContract,
  withdrawableAmountQuery,
  withdrawRequestsQuery,
  exchangeRateQuery,
}: Variables): StringifiedVariables {
  return {
    bLunaHubContract,
    withdrawableAmountQuery: JSON.stringify(withdrawableAmountQuery),
    withdrawRequestsQuery: JSON.stringify(withdrawRequestsQuery),
    exchangeRateQuery: JSON.stringify(exchangeRateQuery),
  };
}

export const query = gql`
  query bLunaClaim(
    $bLunaHubContract: String!
    $withdrawableAmountQuery: String!
    $withdrawRequestsQuery: String!
  ) {
    withdrawableAmount: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $withdrawableAmountQuery
    ) {
      Result
    }

    withdrawRequests: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $withdrawRequestsQuery
    ) {
      Result
    }
  }
`;
