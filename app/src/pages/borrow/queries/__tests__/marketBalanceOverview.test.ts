import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../marketBalanceOverview';

export async function getMarketBalance() {
  return await testClient
    .query<RawData, RawVariables>({
      query,
      variables: mapVariables({
        marketContractAddress: testAddressProvider.market('uusd'),
        marketStateQuery: {
          state: {},
        },
      }),
    })
    .then(({ data }) => map(data, dataMap));
}

describe('queries/marketBalanceOverview', () => {
  test('should get result from query', async () => {
    const data = await getMarketBalance();
    expect(typeof data.marketState?.total_liabilities).toBe('string');
  });
});
