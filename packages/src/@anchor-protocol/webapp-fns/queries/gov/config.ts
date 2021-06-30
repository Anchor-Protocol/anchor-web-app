import { anchorToken } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface GovConfigWasmQuery {
  govConfig: WasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>;
}

export type GovConfig = WasmQueryData<GovConfigWasmQuery>;

export type GovConfigQueryParams = Omit<
  MantleParams<GovConfigWasmQuery>,
  'query' | 'variables'
>;

export async function govConfigQuery({
  mantleEndpoint,
  ...params
}: GovConfigQueryParams): Promise<GovConfig> {
  return mantle<GovConfigWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--config`,
    variables: {},
    ...params,
  });
}
