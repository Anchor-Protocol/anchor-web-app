import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
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
          ANCTerraswap: testAddressProvider.terraswapAncUstPair(),
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.ancPrice?.ANCPrice).toBe('string');
  });
});
