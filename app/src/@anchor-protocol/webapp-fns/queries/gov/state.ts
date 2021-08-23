import { anchorToken } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

export interface GovStateWasmQuery {
  govState: WasmQuery<anchorToken.gov.State, anchorToken.gov.StateResponse>;
  govConfig: WasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>;
}

export type GovState = WasmQueryData<GovStateWasmQuery>;

export type GovStateQueryParams = Omit<
  MantleParams<GovStateWasmQuery>,
  'query' | 'variables'
>;

export async function govStateQuery({
  mantleEndpoint,
  ...params
}: GovStateQueryParams): Promise<GovState> {
  return mantle<GovStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--state`,
    variables: {},
    ...params,
  });
}
