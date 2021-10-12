import { LcdQueryClient } from '@libs/query-client';
import { NativeDenom, Token, u } from '@libs/types';

export async function terraTreasuryTaxCapQuery<T extends Token>(
  denom: NativeDenom,
  lcdClient: LcdQueryClient,
): Promise<u<T>> {
  return lcdClient
    .lcdFetcher<{ result: u<T> }>(
      `${lcdClient.lcdEndpoint}/treasury/tax_cap/${denom}`,
      lcdClient.requestInit,
    )
    .then(({ result }) => result);
}
