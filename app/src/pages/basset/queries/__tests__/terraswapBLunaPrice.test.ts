import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../terraswapBLunaPrice';

describe('queries/terraswapBLunaPrice', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          bLunaTerraswap: testAddressProvider.terraswapblunaLunaPair(),
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(parseInt(data.terraswapPoolInfo?.bLunaPrice ?? '')).not.toBeNaN();
  });
});
