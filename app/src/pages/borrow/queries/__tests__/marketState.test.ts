import { map } from '@terra-dev/use-map';
import {
  testAddress,
  testClient,
} from '@anchor-protocol/web-contexts/test.env';
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
        marketContractAddress: testAddress.moneyMarket.market,
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
