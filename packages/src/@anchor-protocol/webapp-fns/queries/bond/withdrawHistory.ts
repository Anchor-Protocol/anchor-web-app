import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BondWithdrawHistoryRawData {
  allHistory: WASMContractResult;
  parameters: WASMContractResult;
}

export interface BondWithdrawHistoryData {
  allHistory: bluna.hub.AllHistoryResponse;
  parameters: bluna.hub.ParametersResponse;
}

export interface BondWithdrawHistoryRawVariables {
  bLunaHubContract: string;
  allHistoryQuery: string;
  parametersQuery: string;
}

export interface BondWithdrawHistoryVariables {
  bLunaHubContract: string;
  allHistoryQuery: bluna.hub.AllHistory;
  parametersQuery: bluna.hub.Parameters;
}

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

export interface BondWithdrawHistoryQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BondWithdrawHistoryVariables;
}

export async function bondWithdrawHistoryQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BondWithdrawHistoryQueryParams): Promise<BondWithdrawHistoryData> {
  const rawData = await mantleFetch<
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
    allHistory: JSON.parse(rawData.allHistory.Result),
    parameters: JSON.parse(rawData.parameters.Result),
  };
}
