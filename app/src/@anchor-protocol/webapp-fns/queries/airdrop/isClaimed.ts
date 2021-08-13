import { bluna } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface AirdropIsClaimedWasmQuery {
  isClaimed: WasmQuery<
    bluna.airdropRegistry.IsClaimed,
    bluna.airdropRegistry.IsClaimedResponse
  >;
}

export type AirdropIsClaimed = WasmQueryData<AirdropIsClaimedWasmQuery>;

export type AirdropIsClaimedQueryParams = Omit<
  MantleParams<AirdropIsClaimedWasmQuery>,
  'query' | 'variables'
>;

export async function airdropIsClaimedQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: AirdropIsClaimedQueryParams): Promise<AirdropIsClaimed> {
  return mantle<AirdropIsClaimedWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?airdrop--is-claimed&address=${wasmQuery.isClaimed.query.is_claimed.address}&stage=${wasmQuery.isClaimed.query.is_claimed.stage}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
