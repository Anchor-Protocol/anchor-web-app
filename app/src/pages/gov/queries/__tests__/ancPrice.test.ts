import { map } from '@anchor-protocol/use-map';
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
} from '../ancPrice';

describe('queries/ancPrice', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          ANCTerraswap: testAddress.terraswap.ancUstPair,
          poolInfoQuery: {
            pool: {},
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.ancPrice?.ANCPrice).toBe('string');
  });
});
