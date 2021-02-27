import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../marketState';

export async function getMarketState() {
  return await testClient
    .query<RawData, RawVariables>({
      query,
      variables: mapVariables({
        marketContractAddress: testAddressProvider.market(''),
        marketStateQuery: {
          state: {},
        },
      }),
    })
    .then(({ data }) => map(data, dataMap));
}

describe('queries/marketState', () => {
  test('should get result from query', async () => {
    const data = await getMarketState();
    expect(typeof data.marketState?.total_liabilities).toBe('string');
  });
});
