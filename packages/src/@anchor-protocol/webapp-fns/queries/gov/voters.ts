import {
  anchorToken,
  HumanAddr,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface GovVotersRawData {
  voters: WASMContractResult;
}

export interface GovVotersData {
  voters: anchorToken.gov.VotersResponse;
}

export interface GovVotersRawVariables {
  govContract: string;
  votersQuery: string;
}

export interface GovVotersVariables {
  govContract: HumanAddr;
  votersQuery: anchorToken.gov.Voters;
}

// language=graphql
export const GOV_VOTERS_QUERY = `
  query ($govContract: String!, $votersQuery: String!) {
    voters: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $votersQuery
    ) {
      Result
    }
  }
`;

export interface GovVotersQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: GovVotersVariables;
}

export async function govVotersQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: GovVotersQueryParams): Promise<GovVotersData> {
  const rawData = await mantleFetch<GovVotersRawVariables, GovVotersRawData>(
    GOV_VOTERS_QUERY,
    {
      govContract: variables.govContract,
      votersQuery: JSON.stringify(variables.votersQuery),
    },
    `${mantleEndpoint}?gov--voters&start_after=${variables.votersQuery.voters.start_after}`,
  );

  return {
    voters: JSON.parse(rawData.voters.Result),
  };
}
