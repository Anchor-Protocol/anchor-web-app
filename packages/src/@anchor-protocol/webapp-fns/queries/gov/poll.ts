import { anchorToken, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface GovPollRawData {
  poll: WASMContractResult;
}

export interface GovPollData {
  poll: anchorToken.gov.PollResponse;
}

export interface GovPollRawVariables {
  govContract: string;
  pollQuery: string;
}

export interface GovPollVariables {
  govContract: string;
  pollQuery: anchorToken.gov.Poll;
}

// language=graphql
export const GOV_POLL_QUERY = `
  query ($govContract: String!, $pollQuery: String!) {
    poll: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $pollQuery
    ) {
      Result
    }
  }
`;

export interface GovPollQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: GovPollVariables;
}

export async function govPollQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: GovPollQueryParams): Promise<GovPollData> {
  const rawData = await mantleFetch<GovPollRawVariables, GovPollRawData>(
    GOV_POLL_QUERY,
    {
      govContract: variables.govContract,
      pollQuery: JSON.stringify(variables.pollQuery),
    },
    `${mantleEndpoint}?gov--poll&poll=${variables.pollQuery.poll.poll_id}`,
  );

  return {
    poll: JSON.parse(rawData.poll.Result),
  };
}
