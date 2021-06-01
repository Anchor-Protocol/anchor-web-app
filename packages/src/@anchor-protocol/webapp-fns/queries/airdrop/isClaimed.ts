import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface AirdropIsClaimedRawData {
  isClaimed: WASMContractResult;
}

export interface AirdropIsClaimedData {
  isClaimed: bluna.airdropRegistry.IsClaimedResponse;
}

export interface AirdropIsClaimedRawVariables {
  airdropContract: string;
  isClaimedQuery: string;
}

export interface AirdropIsClaimedVariables {
  airdropContract: string;
  isClaimedQuery: bluna.airdropRegistry.IsClaimed;
}

// language=graphql
export const AIRDROP_IS_CLAIMED_QUERY = `
  query ($airdropContract: String!, $isClaimedQuery: String!) {
    isClaimed: WasmContractsContractAddressStore(
      ContractAddress: $airdropContract
      QueryMsg: $isClaimedQuery
    ) {
      Result
    }
  }
`;

export interface AirdropIsClaimedQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: AirdropIsClaimedVariables;
}

export async function airdropIsClaimedQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: AirdropIsClaimedQueryParams): Promise<AirdropIsClaimedData> {
  const rawData = await mantleFetch<
    AirdropIsClaimedRawVariables,
    AirdropIsClaimedRawData
  >(
    AIRDROP_IS_CLAIMED_QUERY,
    {
      airdropContract: variables.airdropContract,
      isClaimedQuery: JSON.stringify(variables.isClaimedQuery),
    },
    `${mantleEndpoint}?airdrop--is-claimed&address=${variables.isClaimedQuery.is_claimed.address}&stage=${variables.isClaimedQuery.is_claimed.stage}`,
  );

  return {
    isClaimed: JSON.parse(rawData.isClaimed.Result),
  };
}
