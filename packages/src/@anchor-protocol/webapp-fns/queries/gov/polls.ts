import {
  anchorToken,
  HumanAddr,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface GovPollsRawData {
  polls: WASMContractResult;
}

export interface GovPollsData {
  polls: anchorToken.gov.PollsResponse;
}

export interface GovPollsRawVariables {
  pollsQuery: string;
  govContract: string;
}

export interface GovPollsVariables {
  govContract: HumanAddr;
  pollsQuery: anchorToken.gov.Polls;
}

// language=graphql
export const GOV_POLLS_QUERY = `
  query ($govContract: String!, $pollsQuery: String!) {
    polls: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $pollsQuery
    ) {
      Result
    }
  }
`;

export interface GovPollsQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: GovPollsVariables;
}

export async function govPollsQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: GovPollsQueryParams): Promise<GovPollsData> {
  const rawData = await mantleFetch<GovPollsRawVariables, GovPollsRawData>(
    GOV_POLLS_QUERY,
    {
      govContract: variables.govContract,
      pollsQuery: JSON.stringify(variables.pollsQuery),
    },
    `${mantleEndpoint}?gov--polls&start_after=${variables.pollsQuery.polls.start_after}`,
  );

  return {
    polls: JSON.parse(rawData.polls.Result),
  };
}
